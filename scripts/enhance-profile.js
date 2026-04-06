const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Enhance the auth modal to include onboarding after sign-in
const oldAuthSheet = `<div class="auth-sub">Save favorites, sync trips, and more</div>`;
const newAuthSheet = `<div class="auth-sub">Save favorites, sync trips, track your food journey</div>`;
html = html.replace(oldAuthSheet, newAuthSheet);

// 2. Update the 👤 button behavior -- when signed in, go to profile directly
const oldAuthBtn = `<button id="auth-btn" onclick="S.user?A.tab('lists'):A.openAuth()" title="Profile" aria-label="Profile">👤</button>`;
const newAuthBtn = `<button id="auth-btn" onclick="S.user?A.showProfile():A.openAuth()" title="Profile" aria-label="Profile">👤</button>`;
html = html.replace(oldAuthBtn, newAuthBtn);
console.log('Updated auth button behavior');

// 3. Add showProfile() method and enhanceProfile after renderProfile
const renderProfileEnd = `<!-- AI Key Setup -->`;
const profileEnhancements = `<!-- Profile Actions -->
      <div style="display:flex;gap:8px;margin-top:12px;margin-bottom:12px">
        <button onclick="A.editProfile()" style="flex:1;padding:10px;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--text2);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">✏️ Edit Profile</button>
        <button onclick="A.emailFavorites()" style="flex:1;padding:10px;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--text2);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">📧 Share Lists</button>
      </div>

      <!-- Account Info -->
      \${S.user ? \`<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Account</div>
        <div style="font-size:12px;color:var(--text);margin-bottom:4px">📧 \${S.user.email||'Not set'}</div>
        <div style="font-size:10px;color:var(--text3);margin-bottom:8px">Signed in via Supabase</div>
        <button onclick="A.signOut()" style="width:100%;padding:8px;background:none;border:1px solid rgba(220,70,70,.2);border-radius:8px;color:var(--text3);font-size:11px;cursor:pointer;font-family:inherit">Sign Out</button>
      </div>\` : \`<div style="background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));border:1px solid rgba(201,168,76,.2);border-radius:10px;padding:14px;margin-bottom:12px;text-align:center">
        <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:4px">Sign in to sync across devices</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Your data is saved locally. Sign in to back it up and access from anywhere.</div>
        <button onclick="A.openAuth()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:12px;padding:10px 20px;border-radius:10px;border:none;cursor:pointer">Sign In →</button>
      </div>\`}

      <!-- AI Key Setup -->`;
html = html.replace(renderProfileEnd, profileEnhancements);
console.log('Added profile actions and account section');

// 4. Update the profile header to show user info
const oldProfileHeader = `<div style="text-align:center;padding:20px 0 16px">
        <div style="width:70px;height:70px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 10px">🍽️</div>
        <div style="font-size:17px;font-weight:800;color:var(--text)">Your Profile</div>
        <div style="font-size:11px;color:var(--text2);margin-top:3px">Appetyt Food Passport</div>
      </div>`;

const newProfileHeader = `<div style="text-align:center;padding:20px 0 16px">
        <div onclick="A.changeAvatar()" style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 10px;cursor:pointer">\${S.userData.avatar||'🍽️'}</div>
        <div style="font-size:17px;font-weight:800;color:var(--text)">\${S.userData.displayName||S.user?.email?.split('@')[0]||'Foodie'}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:3px">\${S.user?.email||'Appetyt Food Passport'}</div>
        <div style="margin-top:6px;display:flex;gap:6px;justify-content:center">
          <span style="font-size:10px;padding:3px 10px;border-radius:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);color:var(--gold);font-weight:600">\${S.city} Explorer</span>
          \${TRIPS.current?'<span style="font-size:10px;padding:3px 10px;border-radius:8px;background:rgba(62,184,168,.1);border:1px solid rgba(62,184,168,.2);color:#3eb8a8;font-weight:600">On Trip</span>':''}
        </div>
      </div>`;
html = html.replace(oldProfileHeader, newProfileHeader);
console.log('Updated profile header with user info');

// 5. Add showProfile, editProfile, changeAvatar, signOut methods
// Find a good place to insert -- after the openAuth method
const openAuthMethod = 'openAuth(){';
const openAuthIdx = html.indexOf(openAuthMethod);
if(openAuthIdx === -1){ console.log('WARNING: could not find openAuth'); }

// Find closeAuth to insert after it
const closeAuthStr = "closeAuth(){document.getElementById('auth-modal').classList.remove('open');},";
const closeAuthIdx = html.indexOf(closeAuthStr);
if(closeAuthIdx !== -1){
  const insertPoint = closeAuthIdx + closeAuthStr.length;
  const newMethods = `

  showProfile(){
    // Navigate to profile tab
    this.listsSub('profile');
    this.tab('lists');
  },

  editProfile(){
    const m = document.getElementById('event-detail-modal');
    if(!m) return;
    const ud = S.userData;
    const avatars = ['🍽️','👨‍🍳','👩‍🍳','🍕','🍣','🌮','🥂','🍸','☕','🎯','✈️','🌍','🏖️','🎭','🎵','🍰','🥘','🍜'];
    m.innerHTML = \`
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display='none'">
        <div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:20px 16px 40px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div style="font-size:16px;font-weight:700;color:var(--gold)">Edit Profile</div>
            <button onclick="document.getElementById('event-detail-modal').style.display='none'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">✕</button>
          </div>

          <!-- Avatar picker -->
          <div style="margin-bottom:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Avatar</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              \${avatars.map(a=>\`<button onclick="document.getElementById('prof-avatar-preview').textContent='\${a}'" style="width:40px;height:40px;border-radius:10px;border:\${a===(ud.avatar||'🍽️')?'2px solid var(--gold)':'1px solid var(--border)'};background:var(--card);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">\${a}</button>\`).join('')}
            </div>
            <div id="prof-avatar-preview" style="display:none">\${ud.avatar||'🍽️'}</div>
          </div>

          <!-- Display name -->
          <div style="margin-bottom:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Display Name</div>
            <input id="prof-name" value="\${ud.displayName||''}" placeholder="Your name" style="width:100%;background:var(--card);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:10px;font-size:13px;font-family:inherit;outline:none">
          </div>

          <!-- Food preferences -->
          <div style="margin-bottom:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Food Preferences</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              \${['Italian','Japanese','Mexican','Thai','Indian','French','Korean','Chinese','Mediterranean','BBQ','Seafood','Vegetarian'].map(pref=>\`<button onclick="this.classList.toggle('active');this.style.borderColor=this.classList.contains('active')?'var(--gold)':'var(--border)';this.style.color=this.classList.contains('active')?'var(--gold)':'var(--text3)'" class="\${(ud.foodPrefs||[]).includes(pref)?'active':''}" style="padding:6px 12px;border-radius:8px;border:1px solid \${(ud.foodPrefs||[]).includes(pref)?'var(--gold)':'var(--border)'};background:var(--card);color:\${(ud.foodPrefs||[]).includes(pref)?'var(--gold)':'var(--text3)'};font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">\${pref}</button>\`).join('')}
            </div>
          </div>

          <!-- Home city -->
          <div style="margin-bottom:16px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Home City</div>
            <input id="prof-city" value="\${ud.homeCity||''}" placeholder="e.g. Dallas, New York" style="width:100%;background:var(--card);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:10px;font-size:13px;font-family:inherit;outline:none">
          </div>

          <button onclick="A.saveProfile()" style="width:100%;background:var(--gold);color:var(--dark);font-weight:800;font-size:14px;padding:13px;border-radius:12px;border:none;cursor:pointer">Save Profile</button>
        </div>
      </div>\`;
    m.style.display='block';
  },

  saveProfile(){
    const name = document.getElementById('prof-name')?.value?.trim();
    const city = document.getElementById('prof-city')?.value?.trim();
    const avatar = document.getElementById('prof-avatar-preview')?.textContent?.trim();
    const prefBtns = document.querySelectorAll('#event-detail-modal button.active');
    const prefs = [...prefBtns].map(b=>b.textContent.trim()).filter(Boolean);

    if(name) S.userData.displayName = name;
    if(city) S.userData.homeCity = city;
    if(avatar) S.userData.avatar = avatar;
    S.userData.foodPrefs = prefs;
    localStorage.setItem('appetyt_data', JSON.stringify(S.userData));

    // Update nickname for trips
    if(name) localStorage.setItem('appetyt_nickname', name);

    document.getElementById('event-detail-modal').style.display='none';
    this.showToast('Profile updated!');
    this.renderProfile();

    // Update the auth button display
    const authBtn = document.getElementById('auth-btn');
    if(authBtn) authBtn.textContent = avatar || '👤';
  },

  changeAvatar(){
    this.editProfile();
  },

  signOut(){
    S.user = null;
    localStorage.removeItem('appetyt_user');
    document.getElementById('auth-btn').classList.remove('on');
    document.getElementById('auth-btn').textContent = '👤';
    const _sab = document.getElementById('sidebar-auth-btn');
    if(_sab){ _sab.classList.remove('signed-in'); }
    const _sal = document.getElementById('sidebar-auth-label');
    if(_sal) _sal.textContent = 'Sign In';
    this.showToast('Signed out');
    this.renderProfile();
  },`;

  html = html.substring(0, insertPoint) + newMethods + html.substring(insertPoint);
  console.log('Added showProfile, editProfile, changeAvatar, signOut methods');
}

// 6. Update the auth button to show avatar when signed in (in init code)
const oldAuthInit = "if(_sal) _sal.textContent=S.user?(S.user.email?.split('@')[0]||'✓ Signed In'):'Sign In';document.getElementById('auth-btn').textContent='✓';";
const newAuthInit = "if(_sal) _sal.textContent=S.user?(S.user.email?.split('@')[0]||'✓ Signed In'):'Sign In';document.getElementById('auth-btn').textContent=S.userData.avatar||'✓';";
html = html.replace(oldAuthInit, newAuthInit);
console.log('Updated auth init to show avatar');

// 7. Initialize userData fields if missing
const userDataInit = "S.userData=JSON.parse(localStorage.getItem('appetyt_data')||'{}');";
if(html.includes(userDataInit)){
  const afterInit = html.indexOf(userDataInit) + userDataInit.length;
  const defaults = "\nif(!S.userData.favs)S.userData.favs=[];if(!S.userData.visited)S.userData.visited=[];if(!S.userData.want)S.userData.want=[];if(!S.userData.avatar)S.userData.avatar='🍽️';if(!S.userData.displayName)S.userData.displayName='';if(!S.userData.foodPrefs)S.userData.foodPrefs=[];if(!S.userData.homeCity)S.userData.homeCity='';";
  // Only add if not already there
  if(!html.substring(afterInit, afterInit+100).includes('avatar')){
    html = html.substring(0, afterInit) + defaults + html.substring(afterInit);
    console.log('Added userData defaults');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
