// Golf Outing Management System - Frontend JavaScript
const API_BASE = 'http://localhost:3000/api';
let currentEvent = null;
let currentDocumentType = null;
let currentDocumentContent = null;

// Helper to get event ID (MongoDB uses _id, old system used id)
function getEventId(event = currentEvent) {
  return event?._id || event?.id;
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  setupSideGameToggles();
  updateFormatVisibility();
});

// ==================== EVENT MANAGEMENT ====================

async function loadEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`);
    const events = await response.json();
    
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
      eventsList.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No events yet. Create your first event!</p>';
      return;
    }
    
    events.forEach(event => {
      const eventItem = document.createElement('li');
      eventItem.className = 'event-item';
      eventItem.innerHTML = `
        <div class="event-info">
          <h3>${event.name}</h3>
          <p>${event.course_name || 'Course TBD'} • ${event.event_date || 'Date TBD'} • ${event.team_size}-man ${event.format}</p>
        </div>
        <div class="button-group">
          <button class="btn btn-primary" onclick="loadEvent('${event.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
        </div>
      `;
      eventsList.appendChild(eventItem);
    });
  } catch (error) {
    showAlert('Failed to load events: ' + error.message, 'error');
  }
}

async function createNewEvent() {
  try {
    const newEvent = {
      name: 'New Golf Outing',
      event_date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      team_size: 4,
      format: 'Captains Choice'
    };
    
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    
    const event = await response.json();
    currentEvent = event;
    
    loadEventIntoForm(event);
    showTab('basic-info');
    showAlert('New event created! Configure your settings and save.', 'success');
  } catch (error) {
    showAlert('Failed to create event: ' + error.message, 'error');
  }
}

async function loadEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}`);
    currentEvent = await response.json();
    
    loadEventIntoForm(currentEvent);
    showTab('basic-info');
    showAlert('Event loaded successfully', 'success');
  } catch (error) {
    showAlert('Failed to load event: ' + error.message, 'error');
  }
}

function loadEventIntoForm(event) {
  currentEvent = event;
  
  // Basic Info
  setFieldValue('name', event.name);
  setFieldValue('event_date', event.event_date);
  setFieldValue('start_time', event.start_time);
  setFieldValue('course_name', event.course_name);
  setFieldValue('course_city', event.course_city);
  setFieldValue('course_state', event.course_state);
  setFieldValue('start_type', event.start_type);
  setFieldValue('holes_played', event.holes_played);
  setFieldValue('field_size', event.field_size);
  setFieldValue('team_size', event.team_size);
  setFieldValue('format', event.format);
  setFieldValue('mens_tee', event.mens_tee);
  setFieldValue('womens_tee', event.womens_tee);
  setFieldValue('seniors_age', event.seniors_age);
  setFieldValue('seniors_tee', event.seniors_tee);
  setFieldValue('super_seniors_age', event.super_seniors_age);
  setFieldValue('super_seniors_tee', event.super_seniors_tee);
  setFieldValue('max_handicap_index', event.max_handicap_index);
  
  // Format & Rules
  setFieldValue('required_drives_per_player', event.required_drives_per_player);
  setFieldValue('penalty_missing_drives', event.penalty_missing_drives);
  setFieldValue('lie_improvement_distance', event.lie_improvement_distance);
  setCheckboxValue('same_cut_requirement', event.same_cut_requirement);
  setCheckboxValue('bunker_rake_and_place', event.bunker_rake_and_place);
  setCheckboxValue('lift_clean_place', event.lift_clean_place);
  setFieldValue('lift_clean_place_areas', event.lift_clean_place_areas);
  setRadioValue('ob_rule', event.ob_rule);
  setCheckboxValue('e5_local_rule', event.e5_local_rule);
  setCheckboxValue('gimme_allowed', event.gimme_allowed);
  setFieldValue('gimme_distance', event.gimme_distance);
  setFieldValue('max_score_rule', event.max_score_rule);
  setFieldValue('max_search_time', event.max_search_time);
  setCheckboxValue('ready_golf', event.ready_golf);
  
  // Handicaps
  setFieldValue('handicap_basis', event.handicap_basis);
  setFieldValue('team_handicap_method', event.team_handicap_method);
  setFieldValue('team_handicap_percentages', event.team_handicap_percentages);
  setRadioValue('competition_type', event.competition_type);
  setCheckboxValue('use_flights', event.use_flights);
  setFieldValue('flight_method', event.flight_method);
  setFieldValue('tiebreak_method', event.tiebreak_method);
  setFieldValue('tiebreak_order', event.tiebreak_order);
  setCheckboxValue('sudden_death', event.sudden_death);
  
  // Side Games
  setCheckboxValue('skins_enabled', event.skins_enabled);
  setFieldValue('skins_type', event.skins_type);
  setFieldValue('skins_entry_fee', event.skins_entry_fee);
  
  setCheckboxValue('ctp_enabled', event.ctp_enabled);
  setFieldValue('ctp_holes', event.ctp_holes);
  setFieldValue('ctp_categories', event.ctp_categories);
  
  setCheckboxValue('long_drive_enabled', event.long_drive_enabled);
  setFieldValue('long_drive_holes', event.long_drive_holes);
  setFieldValue('long_drive_categories', event.long_drive_categories);
  
  setCheckboxValue('straight_drive_enabled', event.straight_drive_enabled);
  setFieldValue('straight_drive_hole', event.straight_drive_hole);
  
  setCheckboxValue('longest_putt_enabled', event.longest_putt_enabled);
  setFieldValue('longest_putt_holes', event.longest_putt_holes);
  
  setCheckboxValue('three_putt_pot_enabled', event.three_putt_pot_enabled);
  setFieldValue('three_putt_amount', event.three_putt_amount);
  
  setCheckboxValue('mulligans_enabled', event.mulligans_enabled);
  setFieldValue('mulligan_price', event.mulligan_price);
  setFieldValue('mulligan_limit', event.mulligan_limit);
  setFieldValue('mulligan_use', event.mulligan_use);
  
  // Fees & Payouts
  setFieldValue('entry_fee_individual', event.entry_fee_individual);
  setFieldValue('entry_fee_team', event.entry_fee_team);
  setFieldValue('entry_includes', event.entry_includes);
  setFieldValue('prize_pool_teams', event.prize_pool_teams);
  setFieldValue('prize_pool_skins', event.prize_pool_skins);
  setFieldValue('prize_pool_ctp', event.prize_pool_ctp);
  setFieldValue('prize_pool_charity', event.prize_pool_charity);
  setFieldValue('prize_type', event.prize_type);
  setFieldValue('payout_structure', event.payout_structure);
  
  // Registration
  setFieldValue('max_teams', event.max_teams);
  setFieldValue('max_players', event.max_players);
  setFieldValue('registration_cutoff', event.registration_cutoff);
  setFieldValue('payment_deadline', event.payment_deadline);
  setCheckboxValue('waitlist_enabled', event.waitlist_enabled);
  
  // Logistics
  setFieldValue('checkin_open_time', event.checkin_open_time);
  setFieldValue('tee_gift', event.tee_gift);
  setFieldValue('cart_assignment_method', event.cart_assignment_method);
  setFieldValue('scoring_method', event.scoring_method);
  setCheckboxValue('live_scoring_enabled', event.live_scoring_enabled);
  
  // Update side game toggle states
  setupSideGameToggles();
  
  // Show teams/players and documents sections
  document.getElementById('no-event-selected').classList.add('hidden');
  document.getElementById('teams-players-content').classList.remove('hidden');
  document.getElementById('no-event-selected-docs').classList.add('hidden');
  document.getElementById('documents-content').classList.remove('hidden');
  document.getElementById('no-event-selected-scoring').classList.add('hidden');
  document.getElementById('scoring-content').classList.remove('hidden');
  
  // Load teams and players
  loadTeamsAndPlayers();
}

async function saveEvent() {
  if (!currentEvent || !getEventId()) {
    showAlert('No event loaded. Create a new event first.', 'error');
    return;
  }
  
  try {
    const eventData = {
      // Basic Info
      name: getFieldValue('name'),
      event_date: getFieldValue('event_date'),
      start_time: getFieldValue('start_time'),
      course_name: getFieldValue('course_name'),
      course_city: getFieldValue('course_city'),
      course_state: getFieldValue('course_state'),
      start_type: getFieldValue('start_type'),
      number_of_flights: parseInt(getFieldValue('number_of_flights')) || 1,
      holes_played: parseInt(getFieldValue('holes_played')) || 18,
      field_size: parseInt(getFieldValue('field_size')) || null,
      team_size: parseInt(getFieldValue('team_size')) || 4,
      format: getFieldValue('format'),
      mens_tee: getFieldValue('mens_tee'),
      womens_tee: getFieldValue('womens_tee'),
      seniors_age: parseInt(getFieldValue('seniors_age')) || 60,
      seniors_tee: getFieldValue('seniors_tee'),
      super_seniors_age: parseInt(getFieldValue('super_seniors_age')) || 70,
      super_seniors_tee: getFieldValue('super_seniors_tee'),
      max_handicap_index: parseFloat(getFieldValue('max_handicap_index')) || 40.0,
      
      // Format & Rules
      required_drives_per_player: parseInt(getFieldValue('required_drives_per_player')) || 4,
      penalty_missing_drives: parseInt(getFieldValue('penalty_missing_drives')) || 2,
      lie_improvement_distance: getFieldValue('lie_improvement_distance'),
      same_cut_requirement: getCheckboxValue('same_cut_requirement') ? 1 : 0,
      bunker_rake_and_place: getCheckboxValue('bunker_rake_and_place') ? 1 : 0,
      lift_clean_place: getCheckboxValue('lift_clean_place') ? 1 : 0,
      lift_clean_place_areas: getFieldValue('lift_clean_place_areas'),
      ob_rule: getRadioValue('ob_rule'),
      e5_local_rule: getCheckboxValue('e5_local_rule') ? 1 : 0,
      gimme_allowed: getCheckboxValue('gimme_allowed') ? 1 : 0,
      gimme_distance: getFieldValue('gimme_distance'),
      max_score_rule: getFieldValue('max_score_rule'),
      max_search_time: parseInt(getFieldValue('max_search_time')) || 3,
      ready_golf: getCheckboxValue('ready_golf') ? 1 : 0,
      
      // Handicaps
      handicap_basis: getFieldValue('handicap_basis'),
      team_handicap_method: getFieldValue('team_handicap_method'),
      team_handicap_percentages: getFieldValue('team_handicap_percentages'),
      competition_type: getRadioValue('competition_type'),
      use_flights: getCheckboxValue('use_flights') ? 1 : 0,
      flight_method: getFieldValue('flight_method'),
      tiebreak_method: getFieldValue('tiebreak_method'),
      tiebreak_order: getFieldValue('tiebreak_order'),
      sudden_death: getCheckboxValue('sudden_death') ? 1 : 0,
      
      // Side Games
      skins_enabled: getCheckboxValue('skins_enabled') ? 1 : 0,
      skins_type: getFieldValue('skins_type'),
      skins_entry_fee: parseFloat(getFieldValue('skins_entry_fee')) || null,
      
      ctp_enabled: getCheckboxValue('ctp_enabled') ? 1 : 0,
      ctp_holes: getFieldValue('ctp_holes'),
      ctp_categories: getFieldValue('ctp_categories'),
      
      long_drive_enabled: getCheckboxValue('long_drive_enabled') ? 1 : 0,
      long_drive_holes: getFieldValue('long_drive_holes'),
      long_drive_categories: getFieldValue('long_drive_categories'),
      
      straight_drive_enabled: getCheckboxValue('straight_drive_enabled') ? 1 : 0,
      straight_drive_hole: getFieldValue('straight_drive_hole'),
      
      longest_putt_enabled: getCheckboxValue('longest_putt_enabled') ? 1 : 0,
      longest_putt_holes: getFieldValue('longest_putt_holes'),
      
      three_putt_pot_enabled: getCheckboxValue('three_putt_pot_enabled') ? 1 : 0,
      three_putt_amount: parseFloat(getFieldValue('three_putt_amount')) || null,
      
      mulligans_enabled: getCheckboxValue('mulligans_enabled') ? 1 : 0,
      mulligan_price: parseFloat(getFieldValue('mulligan_price')) || null,
      mulligan_limit: parseInt(getFieldValue('mulligan_limit')) || null,
      mulligan_use: getFieldValue('mulligan_use'),
      
      // Fees & Payouts
      entry_fee_individual: parseFloat(getFieldValue('entry_fee_individual')) || null,
      entry_fee_team: parseFloat(getFieldValue('entry_fee_team')) || null,
      entry_includes: getFieldValue('entry_includes'),
      prize_pool_teams: parseFloat(getFieldValue('prize_pool_teams')) || null,
      prize_pool_skins: parseFloat(getFieldValue('prize_pool_skins')) || null,
      prize_pool_ctp: parseFloat(getFieldValue('prize_pool_ctp')) || null,
      prize_pool_charity: parseFloat(getFieldValue('prize_pool_charity')) || null,
      prize_type: getFieldValue('prize_type'),
      payout_structure: getFieldValue('payout_structure'),
      
      // Registration
      max_teams: parseInt(getFieldValue('max_teams')) || null,
      max_players: parseInt(getFieldValue('max_players')) || null,
      registration_cutoff: getFieldValue('registration_cutoff'),
      payment_deadline: getFieldValue('payment_deadline'),
      waitlist_enabled: getCheckboxValue('waitlist_enabled') ? 1 : 0,
      
      // Logistics
      checkin_open_time: getFieldValue('checkin_open_time'),
      tee_gift: getFieldValue('tee_gift'),
      cart_assignment_method: getFieldValue('cart_assignment_method'),
      scoring_method: getFieldValue('scoring_method'),
      live_scoring_enabled: getCheckboxValue('live_scoring_enabled') ? 1 : 0
    };
    
    const response = await fetch(`${API_BASE}/events/${getEventId()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save event');
    }
    
    const updatedEvent = await response.json();
    currentEvent = updatedEvent;
    
    showAlert('Event saved successfully!', 'success');
    loadEvents();
  } catch (error) {
    showAlert('Failed to save event: ' + error.message, 'error');
  }
}

async function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    
    showAlert('Event deleted successfully', 'success');
    loadEvents();
    
    if (currentEvent && getEventId() === eventId) {
      currentEvent = null;
      showTab('events');
    }
  } catch (error) {
    showAlert('Failed to delete event: ' + error.message, 'error');
  }
}

// ==================== TEAMS & PLAYERS MANAGEMENT ====================

async function loadTeamsAndPlayers() {
  if (!currentEvent) return;
  
  try {
    const eventId = currentEvent._id || getEventId();
    const [teamsResponse, playersResponse] = await Promise.all([
      fetch(`${API_BASE}/events/${eventId}/teams`),
      fetch(`${API_BASE}/events/${eventId}/players`)
    ]);
    
    const teams = await teamsResponse.json();
    const players = await playersResponse.json();
    
    // Ensure teams and players are arrays
    const teamsArray = Array.isArray(teams) ? teams : [];
    const playersArray = Array.isArray(players) ? players : [];
    
    displayFlightInfo(teamsArray);
    displayTeams(teamsArray);
    displayPlayers(playersArray);
  } catch (error) {
    showAlert('Failed to load teams and players: ' + error.message, 'error');
  }
}

function displayFlightInfo(teams) {
  const flightInfo = document.getElementById('flight-info');
  const numberOfFlights = currentEvent.number_of_flights || 1;
  
  // Count teams per flight
  const flightCounts = {};
  teams.forEach(team => {
    const flightNum = team.flight_number || 1;
    flightCounts[flightNum] = (flightCounts[flightNum] || 0) + 1;
  });
  
  let infoHTML = `<strong>Configured Flights: ${numberOfFlights}</strong><br>`;
  if (Object.keys(flightCounts).length > 0) {
    infoHTML += 'Current Distribution: ';
    for (let i = 1; i <= numberOfFlights; i++) {
      infoHTML += `Flight ${i}: ${flightCounts[i] || 0} teams${i < numberOfFlights ? ' | ' : ''}`;
    }
  } else {
    infoHTML += '<span style="color: #666;">No teams assigned to flights yet</span>';
  }
  
  flightInfo.innerHTML = infoHTML;
}

function displayTeams(teams) {
  const teamsList = document.getElementById('teams-list');
  teamsList.innerHTML = '';
  
  if (teams.length === 0) {
    teamsList.innerHTML = '<p style="color: #666; padding: 10px;">No teams yet. Add teams to get started.</p>';
    return;
  }
  
  teams.forEach(team => {
    const teamElement = document.createElement('div');
    teamElement.className = 'event-item';
    teamElement.innerHTML = `
      <div class="event-info">
        <h4>Team ${team.team_number || ''}: ${team.team_name || 'Unnamed Team'}</h4>
        <p>Score: ${team.gross_score || 'N/A'} | Handicap: ${team.team_handicap || 'TBD'} | Flight: ${team.flight || 'Unassigned'}</p>
      </div>
      <div class="button-group">
        <button class="btn btn-secondary" onclick="editTeam('${team.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteTeam('${team.id}')">Delete</button>
      </div>
    `;
    teamsList.appendChild(teamElement);
  });
}

function displayPlayers(players) {
  const playersList = document.getElementById('players-list');
  playersList.innerHTML = '';
  
  if (players.length === 0) {
    playersList.innerHTML = '<p style="color: #666; padding: 10px;">No players yet. Add players to get started.</p>';
    return;
  }
  
  players.forEach(player => {
    const playerElement = document.createElement('div');
    playerElement.className = 'event-item';
    playerElement.innerHTML = `
      <div class="event-info">
        <h4>${player.first_name} ${player.last_name}</h4>
        <p>HCP: ${player.handicap_index || 'N/A'} | Email: ${player.email || 'N/A'} | Phone: ${player.phone || 'N/A'}</p>
      </div>
      <div class="button-group">
        <button class="btn btn-secondary" onclick="editPlayer('${player.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deletePlayer('${player.id}')">Delete</button>
      </div>
    `;
    playersList.appendChild(playerElement);
  });
}

function addTeam() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  const teamName = prompt('Enter team name:');
  if (!teamName) return;
  
  const teamNumber = prompt('Enter team number:');
  if (!teamNumber) return;
  
  createTeam({
    event_id: getEventId(),
    team_name: teamName,
    team_number: parseInt(teamNumber)
  });
}

async function createTeam(teamData) {
  try {
    const response = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create team');
    }
    
    showAlert('Team created successfully', 'success');
    loadTeamsAndPlayers();
  } catch (error) {
    showAlert('Failed to create team: ' + error.message, 'error');
  }
}

function editTeam(teamId) {
  showAlert('Team editing coming soon!', 'success');
}

async function deleteTeam(teamId) {
  if (!confirm('Delete this team?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete team');
    }
    
    showAlert('Team deleted successfully', 'success');
    loadTeamsAndPlayers();
  } catch (error) {
    showAlert('Failed to delete team: ' + error.message, 'error');
  }
}

async function assignFlights() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  if (!confirm('This will assign teams to flights based on their current scores (best to worst). Continue?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/events/${getEventId()}/assign-flights`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to assign flights');
    }
    
    const result = await response.json();
    showAlert(result.message, 'success');
    loadTeamsAndPlayers();
  } catch (error) {
    showAlert('Failed to assign flights: ' + error.message, 'error');
  }
}

function addPlayer() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  const firstName = prompt('Enter player first name:');
  if (!firstName) return;
  
  const lastName = prompt('Enter player last name:');
  if (!lastName) return;
  
  const email = prompt('Enter player email (optional):') || '';
  const handicap = prompt('Enter handicap index (optional):') || null;
  
  createPlayer({
    event_id: getEventId(),
    first_name: firstName,
    last_name: lastName,
    email: email,
    handicap_index: handicap ? parseFloat(handicap) : null
  });
}

async function createPlayer(playerData) {
  try {
    const response = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create player');
    }
    
    showAlert('Player created successfully', 'success');
    loadTeamsAndPlayers();
  } catch (error) {
    showAlert('Failed to create player: ' + error.message, 'error');
  }
}

function editPlayer(playerId) {
  showAlert('Player editing coming soon!', 'success');
}

async function deletePlayer(playerId) {
  if (!confirm('Delete this player?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/players/${playerId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete player');
    }
    
    showAlert('Player deleted successfully', 'success');
    loadTeamsAndPlayers();
  } catch (error) {
    showAlert('Failed to delete player: ' + error.message, 'error');
  }
}

// ==================== DOCUMENT GENERATION ====================

async function generateDocument(type) {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/events/${getEventId()}/documents/${type}`);
    
    if (!response.ok) {
      throw new Error('Failed to generate document');
    }
    
    const data = await response.json();
    currentDocumentType = type;
    currentDocumentContent = data.document;
    
    document.getElementById('document-content').textContent = data.document;
    document.getElementById('document-output').classList.remove('hidden');
    
    // Scroll to document
    document.getElementById('document-output').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showAlert('Failed to generate document: ' + error.message, 'error');
  }
}

function copyDocument() {
  if (!currentDocumentContent) return;
  
  navigator.clipboard.writeText(currentDocumentContent).then(() => {
    showAlert('Document copied to clipboard!', 'success');
  }).catch(() => {
    showAlert('Failed to copy document', 'error');
  });
}

function downloadDocument() {
  if (!currentDocumentContent || !currentDocumentType) return;
  
  const filename = `${currentEvent.name.replace(/[^a-z0-9]/gi, '_')}_${currentDocumentType}.txt`;
  const blob = new Blob([currentDocumentContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  showAlert('Document downloaded!', 'success');
}

// ==================== UI HELPERS ====================

function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));
  
  // Show selected tab
  const selectedTab = Array.from(tabs).find(tab => tab.textContent.trim().toLowerCase().includes(tabName.replace('-', ' ')));
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  const selectedContent = document.getElementById(tabName);
  if (selectedContent) {
    selectedContent.classList.add('active');
  }
  
  // Show/hide save button (don't show on events, documents, teams-players, and live-scoring tabs)
  const saveButton = document.getElementById('save-button-container');
  if (tabName === 'events' || tabName === 'documents' || tabName === 'teams-players' || tabName === 'live-scoring') {
    saveButton.style.display = 'none';
  } else {
    saveButton.style.display = 'flex';
  }
}

function showAlert(message, type = 'success') {
  const container = document.getElementById('alert-container');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  container.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function setupSideGameToggles() {
  // Skins
  const skinsCheckbox = document.getElementById('skins_enabled');
  const skinsOptions = document.getElementById('skins-options');
  if (skinsCheckbox) {
    skinsCheckbox.addEventListener('change', () => {
      if (skinsCheckbox.checked) {
        skinsOptions.classList.remove('hidden');
      } else {
        skinsOptions.classList.add('hidden');
      }
    });
    // Trigger initial state
    if (skinsCheckbox.checked) {
      skinsOptions.classList.remove('hidden');
    }
  }
  
  // CTP
  const ctpCheckbox = document.getElementById('ctp_enabled');
  const ctpOptions = document.getElementById('ctp-options');
  if (ctpCheckbox) {
    ctpCheckbox.addEventListener('change', () => {
      if (ctpCheckbox.checked) {
        ctpOptions.classList.remove('hidden');
      } else {
        ctpOptions.classList.add('hidden');
      }
    });
    if (ctpCheckbox.checked) {
      ctpOptions.classList.remove('hidden');
    }
  }
  
  // Long Drive
  const longDriveCheckbox = document.getElementById('long_drive_enabled');
  const longDriveOptions = document.getElementById('long-drive-options');
  if (longDriveCheckbox) {
    longDriveCheckbox.addEventListener('change', () => {
      if (longDriveCheckbox.checked) {
        longDriveOptions.classList.remove('hidden');
      } else {
        longDriveOptions.classList.add('hidden');
      }
    });
    if (longDriveCheckbox.checked) {
      longDriveOptions.classList.remove('hidden');
    }
  }
  
  // Straight Drive
  const straightDriveCheckbox = document.getElementById('straight_drive_enabled');
  const straightDriveOptions = document.getElementById('straight-drive-options');
  if (straightDriveCheckbox) {
    straightDriveCheckbox.addEventListener('change', () => {
      if (straightDriveCheckbox.checked) {
        straightDriveOptions.classList.remove('hidden');
      } else {
        straightDriveOptions.classList.add('hidden');
      }
    });
    if (straightDriveCheckbox.checked) {
      straightDriveOptions.classList.remove('hidden');
    }
  }
  
  // Longest Putt
  const longestPuttCheckbox = document.getElementById('longest_putt_enabled');
  const longestPuttOptions = document.getElementById('longest-putt-options');
  if (longestPuttCheckbox) {
    longestPuttCheckbox.addEventListener('change', () => {
      if (longestPuttCheckbox.checked) {
        longestPuttOptions.classList.remove('hidden');
      } else {
        longestPuttOptions.classList.add('hidden');
      }
    });
    if (longestPuttCheckbox.checked) {
      longestPuttOptions.classList.remove('hidden');
    }
  }
  
  // 3-Putt Pot
  const threePuttCheckbox = document.getElementById('three_putt_pot_enabled');
  const threePuttOptions = document.getElementById('three-putt-options');
  if (threePuttCheckbox) {
    threePuttCheckbox.addEventListener('change', () => {
      if (threePuttCheckbox.checked) {
        threePuttOptions.classList.remove('hidden');
      } else {
        threePuttOptions.classList.add('hidden');
      }
    });
    if (threePuttCheckbox.checked) {
      threePuttOptions.classList.remove('hidden');
    }
  }
  
  // Mulligans
  const mulligansCheckbox = document.getElementById('mulligans_enabled');
  const mulligansOptions = document.getElementById('mulligan-options');
  if (mulligansCheckbox) {
    mulligansCheckbox.addEventListener('change', () => {
      if (mulligansCheckbox.checked) {
        mulligansOptions.classList.remove('hidden');
      } else {
        mulligansOptions.classList.add('hidden');
      }
    });
    if (mulligansCheckbox.checked) {
      mulligansOptions.classList.remove('hidden');
    }
  }
}

// ==================== FORM HELPERS ====================

function getFieldValue(fieldId) {
  const field = document.getElementById(fieldId);
  return field ? field.value : '';
}

function setFieldValue(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.value = value || '';
  }
}

function getCheckboxValue(fieldId) {
  const field = document.getElementById(fieldId);
  return field ? field.checked : false;
}

function setCheckboxValue(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.checked = value == 1 || value === true;
  }
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

function setRadioValue(name, value) {
  const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (radio) {
    radio.checked = true;
  }
}

// ==================== LIVE SCORING FUNCTIONS ====================

async function generateAllAccessCodes() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  try {
    const teamsResponse = await fetch(`${API_BASE}/events/${getEventId()}/teams`);
    const teams = await teamsResponse.json();
    
    if (teams.length === 0) {
      showAlert('No teams found. Please add teams first.', 'error');
      return;
    }
    
    let generated = 0;
    for (const team of teams) {
      if (!team.access_code) {
        const response = await fetch(`${API_BASE}/teams/${team.id}/generate-code`, {
          method: 'POST'
        });
        if (response.ok) {
          generated++;
        }
      }
    }
    
    showAlert(`Generated ${generated} new access codes!`, 'success');
    viewAccessCodes();
  } catch (error) {
    showAlert('Failed to generate access codes: ' + error.message, 'error');
  }
}

async function viewAccessCodes() {
  if (!currentEvent) return;
  
  try {
    const response = await fetch(`${API_BASE}/events/${getEventId()}/teams`);
    const teams = await response.json();
    
    const container = document.getElementById('access-codes-list');
    container.innerHTML = '';
    
    if (teams.length === 0) {
      container.innerHTML = '<p style="color: #666;">No teams found.</p>';
      return;
    }
    
    const table = document.createElement('div');
    table.style.background = '#f9f9f9';
    table.style.padding = '20px';
    table.style.borderRadius = '6px';
    
    let html = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #ddd;">
            <th style="padding: 10px; text-align: left;">Team</th>
            <th style="padding: 10px; text-align: center;">Access Code</th>
            <th style="padding: 10px; text-align: center;">Mobile Link</th>
            <th style="padding: 10px; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    teams.forEach(team => {
      const teamName = team.team_name || `Team ${team.team_number}`;
      const accessCode = team.access_code || '-';
      const mobileLink = team.access_code ? 
        `${window.location.origin}/mobile.html?code=${team.access_code}` : '-';
      
      html += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">${teamName}</td>
          <td style="padding: 10px; text-align: center; font-weight: bold; font-size: 18px; color: #2c5f2d;">
            ${accessCode}
          </td>
          <td style="padding: 10px; text-align: center;">
            ${team.access_code ? 
              `<a href="${mobileLink}" target="_blank" style="color: #2c5f2d;">Open Link</a>` : 
              '-'}
          </td>
          <td style="padding: 10px; text-align: center;">
            ${!team.access_code ? 
              `<button class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="generateCodeForTeam('${team.id}')">Generate</button>` :
              `<button class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="copyToClipboard('${accessCode}')">Copy Code</button>`}
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    table.innerHTML = html;
    container.appendChild(table);
  } catch (error) {
    showAlert('Failed to load access codes: ' + error.message, 'error');
  }
}

async function generateCodeForTeam(teamId) {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}/generate-code`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showAlert('Access code generated!', 'success');
      viewAccessCodes();
    }
  } catch (error) {
    showAlert('Failed to generate code: ' + error.message, 'error');
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showAlert('Access code copied to clipboard!', 'success');
  }).catch(() => {
    showAlert('Failed to copy code', 'error');
  });
}

async function loadAuditTrail() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/events/${getEventId()}/audit`);
    const auditData = await response.json();
    
    const container = document.getElementById('audit-trail');
    
    if (auditData.length === 0) {
      container.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No score changes recorded yet.</p>';
      return;
    }
    
    let html = `
      <div style="background: white; border-radius: 6px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #2c5f2d; color: white;">
            <tr>
              <th style="padding: 12px; text-align: left;">Team</th>
              <th style="padding: 12px; text-align: center;">Hole</th>
              <th style="padding: 12px; text-align: center;">Old Score</th>
              <th style="padding: 12px; text-align: center;">New Score</th>
              <th style="padding: 12px; text-align: left;">Changed By</th>
              <th style="padding: 12px; text-align: center;">Source</th>
              <th style="padding: 12px; text-align: left;">Time</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    auditData.forEach((entry, index) => {
      const bgColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      const timestamp = new Date(entry.timestamp).toLocaleString();
      
      html += `
        <tr style="background: ${bgColor};">
          <td style="padding: 10px;">${entry.team_name || `Team ${entry.team_number}`}</td>
          <td style="padding: 10px; text-align: center; font-weight: bold;">${entry.hole_number}</td>
          <td style="padding: 10px; text-align: center;">${entry.old_strokes || '-'}</td>
          <td style="padding: 10px; text-align: center; color: #2c5f2d; font-weight: bold;">${entry.new_strokes}</td>
          <td style="padding: 10px;">${entry.changed_by || 'Unknown'}</td>
          <td style="padding: 10px; text-align: center;">
            <span style="padding: 4px 8px; background: ${entry.change_source === 'mobile' ? '#e7f3ff' : '#fff3e7'}; 
                         border-radius: 4px; font-size: 12px;">
              ${entry.change_source || 'manual'}
            </span>
          </td>
          <td style="padding: 10px; font-size: 13px; color: #666;">${timestamp}</td>
        </tr>
      `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (error) {
    showAlert('Failed to load audit trail: ' + error.message, 'error');
  }
}

function exportAuditTrail() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  fetch(`${API_BASE}/events/${getEventId()}/audit`)
    .then(response => response.json())
    .then(auditData => {
      if (auditData.length === 0) {
        showAlert('No audit data to export', 'error');
        return;
      }
      
      // Create CSV content
      const headers = ['Team', 'Hole', 'Old Score', 'New Score', 'Changed By', 'Source', 'Timestamp'];
      const rows = auditData.map(entry => [
        entry.team_name || `Team ${entry.team_number}`,
        entry.hole_number,
        entry.old_strokes || '',
        entry.new_strokes,
        entry.changed_by || '',
        entry.change_source || '',
        entry.timestamp
      ]);
      
      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentEvent.name.replace(/[^a-z0-9]/gi, '_')}_audit_trail.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      showAlert('Audit trail exported!', 'success');
    })
    .catch(error => {
      showAlert('Failed to export audit trail: ' + error.message, 'error');
    });
}

// ==================== FORMAT VISIBILITY ====================

function updateFormatVisibility() {
  const format = getFieldValue('format') || 'Captains Choice';
  const scrambleElements = document.querySelectorAll('.scramble-only');
  
  if (format === 'Captains Choice') {
    scrambleElements.forEach(el => el.classList.add('visible'));
  } else {
    scrambleElements.forEach(el => el.classList.remove('visible'));
  }
}

// ==================== PRIZE DISTRIBUTION CALCULATOR ====================

async function calculatePrizeDistribution() {
  if (!currentEvent) {
    showAlert('Please select an event first', 'error');
    return;
  }
  
  const totalPurse = parseFloat(document.getElementById('calc_total_purse').value);
  const placesToPay = parseInt(document.getElementById('calc_places_to_pay').value);
  
  if (!totalPurse || totalPurse <= 0) {
    showAlert('Please enter a valid total purse amount', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/events/${getEventId()}/calculate-prizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalPurse, placesToPay })
    });
    
    if (!response.ok) {
      throw new Error('Failed to calculate prize distribution');
    }
    
    const data = await response.json();
    
    if (data.error) {
      showAlert(data.error, 'error');
      return;
    }
    
    displayPrizeDistribution(data);
  } catch (error) {
    showAlert('Failed to calculate prizes: ' + error.message, 'error');
  }
}

function displayPrizeDistribution(data) {
  const resultsDiv = document.getElementById('prize-distribution-results');
  
  let html = `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 2px solid #2c5f2d;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Total Purse</div>
          <div style="font-size: 24px; font-weight: bold; color: #2c5f2d;">$${data.totalPurse.toLocaleString()}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Flights</div>
          <div style="font-size: 24px; font-weight: bold; color: #2c5f2d;">${data.numberOfFlights}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Total Teams</div>
          <div style="font-size: 24px; font-weight: bold; color: #2c5f2d;">${data.totalTeams}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Total Awarded</div>
          <div style="font-size: 24px; font-weight: bold; color: #2c5f2d;">$${data.totalAwarded.toLocaleString()}</div>
        </div>
      </div>
      
      ${data.leftover > 0 ? `
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 20px; text-align: center; color: #856404;">
          <strong>Leftover amount (rounded to keep prizes even):</strong> $${data.leftover.toLocaleString()}
        </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
  `;
  
  data.distribution.forEach(flight => {
    html += `
      <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
        <h4 style="margin: 0 0 10px 0; color: #2c5f2d; font-size: 16px;">${flight.flightName}</h4>
        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">~${flight.teamsInFlight} teams</div>
        <table style="width: 100%; font-size: 14px;">
    `;
    
    flight.prizes.forEach(prize => {
      html += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0;">${getOrdinal(prize.place)} Place</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${prize.amount.toLocaleString()}</td>
        </tr>
      `;
    });
    
    html += `
          <tr style="font-weight: bold; border-top: 2px solid #2c5f2d;">
            <td style="padding: 8px 0;">Flight Total</td>
            <td style="padding: 8px 0; text-align: right; color: #2c5f2d;">$${flight.flightTotal.toLocaleString()}</td>
          </tr>
        </table>
      </div>
    `;
  });
  
  html += `
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 4px; font-size: 13px; color: #2c5f2d;">
        <strong>💡 Tip:</strong> Prize amounts are rounded to the nearest $5 for easy distribution. 
        ${data.numberOfFlights > 1 ? 'Each flight has equal prize amounts to ensure fair competition.' : ''}
      </div>
    </div>
  `;
  
  resultsDiv.innerHTML = html;
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
