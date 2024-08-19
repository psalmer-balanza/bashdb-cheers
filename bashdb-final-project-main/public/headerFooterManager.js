//Created by Bruce Balderas and Crisha De Guzman
class SpecialHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header>
          <div class="head">
          <div class="logo">
              <img src="images/logo.png" alt="Logo">
          </div>
          <div class="cheers">
              <h1>Cheers</h1>
          </div>
          </div>
          <style>
            .head {
                width:100%;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                text-align: center;
                background-color: #073066;
            }
            .logo img {
                width: 60px;
                height: auto;
            }
            .cheers h1 {
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: white;
                margin: 0;
            }
          </style>
        </header>
      `;
    }
  }
  //Created by Bruce Balderas and Crisha De Guzman
  class SpecialFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <p style="
            background-color: #073066;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 13px;
            color: white;
            text-align: left;
            padding: 20px 40px;
            position: fixed;
            bottom: 0;
            width: 100%;
          ">&copy; BASHDB - 9474AB - IT312/312L - 1ST SEMESTER AY 2023 - 2024 SCHOOL OF ACCOUNTANCY, MANAGEMENT, COMPUTING, AND INFORMATION STUDIES - SAINT LOUIS UNIVERSITY.</p>
        </footer>
      `;
    }
  }
  

customElements.define('special-header', SpecialHeader)
customElements.define('special-footer', SpecialFooter)