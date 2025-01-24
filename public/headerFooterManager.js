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
              <h1>Saint Louis University</h1>
              <h2>Baguio City, Philippines</h2>
          </div>
          </div>
          <style>
            .head {
                width:100%;
                display: flex;
                align-items: center;
                width: 100%;
                text-align: left;
                background-color: #073066;
                position: fixed;
                top:0;
            }
            .logo img {
                width: 60px;
                height: auto;
                text-align: left;
            }
            .cheers h1 {
                letter-spacing: 1.5px;
                color: white;
                margin: 0;
                font-size: 20px;
            }
              .cheers h2{
              text-align: left;
              color: white;
              font-size: 10px;
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