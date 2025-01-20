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
        ">&copy; BASHDB - 9474AB - IT312/312L - 1ST SEMESTER AY 2023 - 2024 SCHOOL OF ACCOUNTANCY, MANAGEMENT, COMPUTING, AND INFORMATION STUDIES SAINT LOUIS UNIVERSITY.</p>
      </footer>
    `;
  }
}
customElements.define('special-footer', SpecialFooter);
customElements.define('special-header', SpecialHeader);


//Created by bruce
//Set the width of the navigation when opened
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
}
//Created by Bruce Balderas
//Set the width of the side navigation to 0
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
//Created by bruce
//Set the width of the side navigation to 250px and the left margin of the page content to 250px
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "250px";
}
//Created by bruce
//Set the width of the side navigation to 0 and the left margin of the page content to 0
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

//Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.6)";
}

//Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "#ffff";
}

// function openNav() {
//   document.getElementById("mySidenav").style.width = "250px";
//   document.getElementById("main").style.marginLeft = "250px";
//   document.getElementById("overlay").style.display = "block";
// }

// function closeNav() {
//   document.getElementById("mySidenav").style.width = "0";
//   document.getElementById("main").style.marginLeft = "0";
//   document.getElementById("overlay").style.display = "none";
// }