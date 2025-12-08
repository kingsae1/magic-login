!function(){function t(t){this.sessionTimeout=(t=t||{}).sessionTimeout||18e5,this.serviceId=t.serviceId||"Service",this.logoUrl=t.logoUrl||"",this.onLogin=t.onLogin||function(){},this.onLogout=t.onLogout||function(){},this.sessionTimer=null,this.user=null,this.overlay=null,this.activeTab="signin",this.isLoading=!1,this.showPassword=!1;var e=this;this.activityHandler=function(){e.user&&(e.user.loginTime=Date.now(),e.startSessionTimer())}}t.prototype.init=function(){this.renderLoginPopup(),this.bindActivityEvents(),this.showLoginPopup()},t.prototype.addStyles=function(){var t;document.getElementById("auth-lib-styles")||((t=document.createElement("style")).id="auth-lib-styles",t.textContent=`
/* ===== Overlay ===== */
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.auth-overlay.show {
  opacity: 1;
}

.auth-overlay.hide {
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
  overflow: hidden !important;
}

/* ===== Container ===== */
.auth-container {
  background: linear-gradient(180deg, #000000f0, #000d2a99);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 380px;
  max-height: 90vh;
  overflow: visible;
  transform: translateY(30px) scale(0.95);
  transition: transform 0.4s;
}
.auth-overlay.show .auth-container {
  transform: translateY(0) scale(1);
}

/* ===== Logo ===== */
.auth-logo-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -15px;
}
.auth-logo-img {
  background: #fff;
  border-radius: 50%;
  padding: 5px;
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.auth-logo-svg {
  background: #fff;
  border-radius: 50%;
  padding: 8px;
  width: 40px;
  height: 40px;
  stroke: #8b5cf6;
}

/* ===== Header/Tabs ===== */
.auth-header {
  padding: 24px 24px 0;
  margin-bottom: 20px;
  width: 65%;
}
.auth-tabs {
  display: flex;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}
.auth-tab {
  background: transparent;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s;
  flex: 1;
}
.auth-tab.active {
  background: #fff;
  color: #000;
}
.auth-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

/* ===== Content ===== */
.auth-content {
  padding: 20px 24px 24px;
}
.auth-title {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px;
  text-align: center;
}

/* ===== Forms ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.auth-error {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
  display: none;
  margin-bottom: 8px;
}

.auth-name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

/* ===== Input ===== */
.auth-input-group {
  position: relative;
  margin-bottom: 16px;
}
.auth-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.auth-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  z-index: 1;
}

.auth-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: #2a2a2a;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}
.auth-input::placeholder {
  color: #888;
}
.auth-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: #333;
}
.auth-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Password Toggle ===== */
.auth-pwd-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}
.auth-pwd-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}
.auth-pwd-toggle svg {
  width: 20px;
  height: 20px;
  stroke: #888;
}

/* ===== Remember Me Checkbox ===== */
.auth-remember-me {
  display: flex;
  align-items: center;
  margin: 4px 0 0 4px; /* 비밀번호 입력 그룹의 기본 margin-bottom: 16px 조정 */
  gap: 8px;
}
.auth-remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #67b8c9; /* 체크박스 색상 변경 */
}
.auth-remember-me label {
  color: #67b8c9;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}


/* ===== Submit button ===== */
.auth-submit {
  background: #fff;
  color: #000;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}
.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
}
.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ===== Spinner ===== */
.auth-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Toast ===== */
.auth-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
}
.auth-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.auth-toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}
.auth-toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}
.auth-toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ===== Footer ===== */
.auth-copyright {
  color: rgba(206, 179, 255, 0.48);
  margin-top: 20px;
  font-size: 12px;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .auth-container {
    width: 95%;
  }
  .auth-name-row {
    grid-template-columns: 1fr;
  }
  .auth-toast {
    bottom: 20px;
    max-width: 90%;
  }
}
`,document.head.appendChild(t))},t.prototype.renderLoginPopup=function(){this.overlay=document.createElement("div"),this.overlay.className="auth-overlay";var t=this.logoUrl?`<img src="${this.logoUrl}" class="auth-logo-img"/>`:`<svg class="auth-logo-svg" viewBox="0 0 24 24" fill="none">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
         </svg>`;this.overlay.innerHTML=`
      <div class="auth-container">
        <div class="auth-logo-wrap">${t}</div>
        <div class="auth-header">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="signin">로그인</button>
            <button class="auth-tab" data-tab="signup">회원가입</button>
          </div>
        </div>

        <div class="auth-content">
          <h1 class="auth-title">로그인</h1>
          <div class="auth-form">
            <div id="authError" class="auth-error"></div>
            <div id="authFormContent"></div>
            <button id="authSubmitBtn" class="auth-submit">로그인</button>
          </div>
        </div>
      </div>

      <div class="auth-copyright">
        Copyright 2025. seewan.park@kt.com (${this.serviceId}). All rights reserved.
      </div>
    `,document.body.appendChild(this.overlay),this.addStyles(),this.bindEvents(),this.renderFormContent()},t.prototype.renderFormContent=function(){var t=document.getElementById("authFormContent"),e="",o=localStorage.getItem("auth_saved_id")||"",e="signup"===this.activeTab?`
        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0z
                   M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <input type="text" id="authName" class="auth-input" placeholder="이름을 입력하세요" required/>
          </div>
        </div>

        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <input type="text" id="authCompany" class="auth-input" placeholder="회사명을 입력하세요" required/>
          </div>
        </div>

        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8
                   M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <input type="email" id="authEmail" class="auth-input" placeholder="이메일을 입력하세요" required/>
          </div>
        </div>

        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684
                   l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13
                   a11.042 11.042 0 005.516 5.516l1.13-2.257
                   a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19
                   a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <input type="tel" id="authPhone" class="auth-input" placeholder="전화번호를 입력하세요" required/>
          </div>
        </div>
      `:`
        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0z
                   M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <input type="text" id="authUserId" class="auth-input" placeholder="아이디를 입력하세요" required value="${o}"/>
          </div>
        </div>

        <div class="auth-input-group">
          <div class="auth-input-wrap">
            <svg class="auth-icon" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6
                   a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7
                   a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input type="password" id="authPassword" class="auth-input" placeholder="비밀번호를 입력하세요" required/>
            <button type="button" class="auth-pwd-toggle" id="authPwdToggle">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 
                     12 5c4.478 0 8.268 2.943 9.542 7
                     -1.274 4.057-5.064 7-9.542 7
                     -4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="auth-remember-me">
            <input type="checkbox" id="authRememberMe" ${""!==o?"checked":""}/>
            <label for="authRememberMe">Remember Me</label>
        </div>
      `;t.innerHTML=e,this.bindPasswordToggle(),"signin"===this.activeTab&&this.bindEnterKey()},t.prototype.bindEvents=function(){var e=this;this.overlay.querySelectorAll(".auth-tab").forEach(function(t){t.addEventListener("click",function(){e.switchTab(this.getAttribute("data-tab"))})}),document.getElementById("authSubmitBtn").addEventListener("click",function(){e.handleSubmit()}),"signin"===this.activeTab&&this.bindEnterKey()},t.prototype.bindEnterKey=function(){var e=this,t=document.getElementById("authPassword");t&&(t.removeEventListener("keyup",this._enterKeyHandler),this._enterKeyHandler=function(t){"Enter"!==t.key&&13!==t.keyCode||(t.preventDefault(),e.handleSubmit())},t.addEventListener("keyup",this._enterKeyHandler))},t.prototype.bindPasswordToggle=function(){var t=this,e=document.getElementById("authPwdToggle");e&&e.addEventListener("click",function(){t.showPassword=!t.showPassword,document.getElementById("authPassword").type=t.showPassword?"text":"password"})},t.prototype.switchTab=function(e){this.activeTab=e;this.overlay.querySelectorAll(".auth-tab").forEach(function(t){t.getAttribute("data-tab")===e?t.classList.add("active"):t.classList.remove("active")});var t=this.overlay.querySelector(".auth-title"),o=document.getElementById("authSubmitBtn");"signup"===e?(t.textContent="계정 생성",o.textContent="계정 생성 요청하기"):(t.textContent="로그인",o.textContent="로그인"),this.renderFormContent()},t.prototype.handleSubmit=function(){"signin"===this.activeTab?this.handleSignIn():this.handleSignUp()},t.prototype.handleSignIn=function(){var o,t=document.getElementById("authUserId"),e=document.getElementById("authPassword"),i=document.getElementById("authRememberMe"),a=t.value.trim(),n=e.value,t=!!i&&i.checked;this.hideError(),a&&n?(t?localStorage.setItem("auth_saved_id",a):localStorage.removeItem("auth_saved_id"),this.setLoading(!0),o=this,fetch("https://magicapi.netlify.app/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:a,password:n,service_id:this.serviceId})}).then(function(t){return t.ok?t.json():t.json().then(function(t){throw new Error(t.message||"로그인에 실패했습니다.")})}).then(function(t){o.setLoading(!1);var e=t?.access_token||t?.token||t?.accessToken;e?sessionStorage.setItem("accessToken",e):console.warn("AccessToken을 찾을 수 없습니다. 응답 구조:",t),o.showToast("로그인에 성공했습니다!","success",1e3),setTimeout(function(){o.login({userId:a,password:n,...t})},500)}).catch(function(t){o.setLoading(!1),o.showToast(t.message||"로그인 중 오류가 발생했습니다.","error",1e3),console.error("Login error:",t)})):this.showToast("아이디와 비밀번호를 모두 입력해주세요.","error",1e3)},t.prototype.handleSignUp=function(){var t,e=document.getElementById("authName").value.trim(),o=document.getElementById("authCompany").value.trim(),i=document.getElementById("authEmail").value.trim(),a=document.getElementById("authPhone").value.trim();this.hideError(),e&&o&&i&&a?(this.setLoading(!0),t=this,setTimeout(function(){t.setLoading(!1),t.showToast("회원가입 요청이 완료되었습니다!","success",1e3),setTimeout(function(){t.login({userId:i,name:e,company:o,email:i,phone:a})},500)},1e3)):this.showToast("모든 필드를 입력해주세요.","error",1e3)},t.prototype.setLoading=function(t){this.isLoading=t;var e=document.getElementById("authSubmitBtn");t?(e.disabled=!0,t="signup"===this.activeTab?"계정 생성 중...":"로그인 중...",e.innerHTML='<span class="auth-spinner"></span>'+t):(e.disabled=!1,e.textContent="signup"===this.activeTab?"계정 생성 요청하기":"로그인")},t.prototype.login=function(t){this.user={id:Date.now(),userId:t.userId,name:t.name||"",company:t.company||"",email:t.email||"",phone:t.phone||"",loginTime:Date.now()},this.startSessionTimer(),this.hideLoginPopup(),this.onLogin(this.user)},t.prototype.logout=function(){var t=this,e=sessionStorage.getItem("accessToken");e?fetch("https://magicapi.netlify.app/api/auth/logout",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e}}).then(function(t){return t.json()}).then(function(t){console.log("Logout successful:",t)}).catch(function(t){console.error("Logout error:",t)}).finally(function(){sessionStorage.removeItem("accessToken"),t.completeLogout()}):t.completeLogout()},t.prototype.completeLogout=function(){this.clearSessionTimer();var t=this.user;this.user=null,this.showLoginPopup(),this.onLogout(t)},t.prototype.startSessionTimer=function(){var t=this;this.clearSessionTimer(),this.sessionTimer=setTimeout(function(){t.logout()},this.sessionTimeout)},t.prototype.clearSessionTimer=function(){this.sessionTimer&&(clearTimeout(this.sessionTimer),this.sessionTimer=null)},t.prototype.bindActivityEvents=function(){var e=this;["click","keydown","scroll","mousemove"].forEach(function(t){window.addEventListener(t,e.activityHandler)})},t.prototype.showLoginPopup=function(){this.overlay&&(this.overlay.classList.remove("hide"),setTimeout(()=>{this.overlay.classList.add("show")},10))},t.prototype.hideLoginPopup=function(){this.overlay&&(this.overlay.classList.remove("show"),setTimeout(()=>{this.overlay.classList.add("hide")},300))},t.prototype.showError=function(t){var e=document.getElementById("authError");e&&(e.style.display="block",e.textContent=t)},t.prototype.hideError=function(){var t=document.getElementById("authError");t&&(t.style.display="none")},t.prototype.showToast=function(t,e,o){e=e||"success",o=o||1e3;var i=document.querySelector(".auth-toast"),a=(i&&i.remove(),document.createElement("div")),i=(a.className="auth-toast "+e,"success"===e?`<svg class="auth-toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
             d="M5 13l4 4L19 7"/>
         </svg>`:`<svg class="auth-toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
             d="M6 18L18 6M6 6l12 12"/>
         </svg>`);a.innerHTML=i+"<span>"+t+"</span>",document.body.appendChild(a),setTimeout(function(){a.classList.add("show")},10),setTimeout(function(){a.classList.remove("show"),setTimeout(function(){a.remove()},300)},o)},window.AuthLibrary=t,console.log("[LOGIN] VERSION : ",.8)}();
