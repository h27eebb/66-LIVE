// 🎯 الأقسام والقنوات (كل قناة فيها كود iframe كامل)
const channelSections = [
  {
    title: "🎯 قنوات الكأس",
    channels: [
      {
        name: "Alkass 1 HD",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/alkass_hd.php?id=one_1"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      },
      {
        name: "Alkass 2 HD",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/alkass_hd.php?id=2"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      },
      {
        name: "Alkass 3 HD",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/alkass_hd.php?id=3"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      }
    ]
  },
  {
    title: "🏟️ قنوات السعودية الرياضية",
    channels: [
      {
        name: "Saudi Sport 1",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/watchtv.php?id=saudi_sport1"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      },
      {
        name: "Saudi Sport 2",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/watchtv.php?id=saudi_sport2"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      },
      {
        name: "Saudi Sport 3",
        iframe: `<iframe width="560" height="315"
            src="https://www.elahmad.com/tv/watchtv.php?id=saudi_sport3"
            style="border:none;"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media"></iframe>`
      }
    ]
  }
];

const container = document.getElementById("sections-container");
const refreshBtn = document.getElementById("refreshBtn");
const intro = document.querySelector(".intro");
const mainContainer = document.querySelector(".container");

// ✨ شاشة البداية
window.addEventListener("load", () => {
  setTimeout(() => {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.remove();
      mainContainer.classList.remove("hidden");
      mainContainer.classList.add("fade-in");
    }, 800);
  }, 2000);
});

// 🧩 عرض الأقسام والقنوات
function renderSections() {
  container.innerHTML = "";

  channelSections.forEach(section => {
    const secDiv = document.createElement("div");
    secDiv.className = "channel-section";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section.title;
    secDiv.appendChild(title);

    section.channels.forEach(channel => {
      const ch = document.createElement("div");
      ch.className = "channel";
      ch.innerHTML = `
        <div class="channel-header">${channel.name}</div>
        <div class="iframe-container">${channel.iframe}</div>
      `;

      // عند الضغط على اسم القناة، يظهر/يخفي iframe
      const header = ch.querySelector(".channel-header");
      header.addEventListener("click", () => {
        // إغلاق كل القنوات الأخرى
        document.querySelectorAll(".channel.active").forEach(c => {
          if (c !== ch) c.classList.remove("active");
        });
        // تبديل الحالة للقناة الحالية
        ch.classList.toggle("active");
      });

      secDiv.appendChild(ch);
    });

    container.appendChild(secDiv);
  });
}

refreshBtn.addEventListener("click", renderSections);
renderSections();
