/* SiLAP Surabaya — prototype logic. No backend, no persistence beyond the tab. */
(function () {
  "use strict";

  /* One vector icon family (Heroicons-style outline) — no emoji as icons. */
  var ICONS = {
    camera: '<path d="M14.5 4h-5L7.7 6.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-3.7L14.5 4Z"/><circle cx="12" cy="13" r="3.5"/>',
    location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    document: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    arrowRight: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    trafficLight: '<rect x="7" y="3" width="10" height="18" rx="3"/><circle cx="12" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="16" r="1.3" fill="currentColor" stroke="none"/>',
    helmet: '<path d="M4 14a8 8 0 0 1 16 0v2H4v-2Z"/><path d="M3 18h18v2H3z"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10 17V7h3.5a3 3 0 0 1 0 6H10"/>',
    arrows: '<path d="M7 7h12m-3-3 3 3-3 3M17 17H5m3-3-3 3 3 3"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    speed: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/><circle cx="12" cy="14" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-.9.7-1.5 1.2-1.5 2.5"/><path d="M12 17h.01"/>',
    warning: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 10v4m0 3h.01"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'
  };

  function iconSvg(name) {
    var body = ICONS[name] || ICONS.info;
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  function hydrateIcons(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("[data-icon]"), function (el) {
      if (el.dataset.iconHydrated) return;
      el.innerHTML = iconSvg(el.dataset.icon);
      el.classList.add("icon-wrap");
      el.dataset.iconHydrated = "1";
    });
  }

  var KATEGORI = [
    { id: "lampu-merah", label: "Melanggar lampu merah", icon: "trafficLight" },
    { id: "helm", label: "Tidak menggunakan helm", icon: "helmet" },
    { id: "parkir-liar", label: "Parkir liar", icon: "parking" },
    { id: "lawan-arah", label: "Melaju di lawan arah", icon: "arrows" },
    { id: "hp-menyetir", label: "Menggunakan HP saat menyetir", icon: "phone" },
    { id: "kecepatan", label: "Kecepatan berlebih", icon: "speed" }
  ];

  var KECAMATAN = [
    "Tunjungan", "Darmo", "Gubeng", "Wonokromo", "Gayungan", "Tambaksari",
    "Bukit Darmo", "Karangpilang", "Semampir", "Kenjeran", "Pabean Cantikan",
    "Sidotopo", "Tegalsari", "Krembangan", "Sepanjang", "Rungkut"
  ];

  var STATUS = {
    Diterima: { cls: "diterima", label: "Diterima" },
    Diverifikasi: { cls: "diverifikasi", label: "Diverifikasi" },
    Ditindaklanjuti: { cls: "ditindaklanjuti", label: "Ditindaklanjuti" },
    Selesai: { cls: "selesai", label: "Selesai" },
    Ditolak: { cls: "ditolak", label: "Ditolak" }
  };

  var DEMO_REPORTS = [
    {
      kode: "SILAP-2026-000417", kategori: "lampu-merah", fotoNama: "bukti-tunjungan.jpg",
      kecamatan: "Tunjungan", patokan: "Depan Mall Tunjungan Plaza, Jl. Basuki Rahmat",
      waktu: "2026-11-24T08:15", plat: "B 3721 KLM", jenisKendaraan: "Motor",
      deskripsi: "Motor melaju saat lampu merah menyala, hampir menabrak pejalan kaki.",
      kontakPelapor: "", status: "Diterima",
      riwayat: [{ status: "Diterima", waktu: "2026-11-24T08:22", aktor: "Sistem", keterangan: "Laporan masuk melalui SiLAP Surabaya." }],
      buktiTindakLanjut: ""
    },
    {
      kode: "SILAP-2026-000412", kategori: "parkir-liar", fotoNama: "bukti-darmo.jpg",
      kecamatan: "Darmo", patokan: "Jl. Darmo dekat halte", waktu: "2026-11-23T14:40",
      plat: "L 1082 ABX", jenisKendaraan: "Mobil",
      deskripsi: "Mobil parkir di badan jalan dan mengganggu arus lalu lintas.",
      kontakPelapor: "", status: "Ditindaklanjuti",
      riwayat: [
        { status: "Diterima", waktu: "2026-11-23T14:46", aktor: "Sistem", keterangan: "Laporan masuk melalui SiLAP Surabaya." },
        { status: "Diverifikasi", waktu: "2026-11-23T16:10", aktor: "Dishub", keterangan: "Bukti dan lokasi sesuai, diteruskan ke Polrestabes Surabaya." },
        { status: "Ditindaklanjuti", waktu: "2026-11-24T09:05", aktor: "Polrestabes Surabaya", keterangan: "Petugas melakukan penertiban dan memberikan teguran kepada pengemudi." }
      ],
      buktiTindakLanjut: "Petugas melakukan penertiban dan memberikan teguran kepada pengemudi."
    },
    {
      kode: "SILAP-2026-000405", kategori: "helm", fotoNama: "bukti-gubeng.jpg",
      kecamatan: "Gubeng", patokan: "Depan Stasiun Gubeng", waktu: "2026-11-22T07:30",
      plat: "B 6614 DEF", jenisKendaraan: "Motor",
      deskripsi: "Pengendara motor tidak menggunakan helm.",
      kontakPelapor: "0812-xxxx-8890", status: "Selesai",
      riwayat: [
        { status: "Diterima", waktu: "2026-11-22T07:38", aktor: "Sistem", keterangan: "Laporan masuk melalui SiLAP Surabaya." },
        { status: "Diverifikasi", waktu: "2026-11-22T10:12", aktor: "Dishub", keterangan: "Laporan valid dan diteruskan." },
        { status: "Ditindaklanjuti", waktu: "2026-11-22T13:20", aktor: "Polrestabes Surabaya", keterangan: "Petugas melakukan razia di lokasi dan menindak pengendara." },
        { status: "Selesai", waktu: "2026-11-23T09:00", aktor: "Polrestabes Surabaya", keterangan: "Tindak lanjut selesai, laporan ditutup." }
      ],
      buktiTindakLanjut: "Petugas melakukan razia di lokasi dan menindak pengendara."
    },
    {
      kode: "SILAP-2026-000398", kategori: "kecepatan", fotoNama: "bukti-semampir.jpg",
      kecamatan: "Semampir", patokan: "Jl. Tambaksari dekat pasar", waktu: "2026-11-21T17:05",
      plat: "B 9033 XYZ", jenisKendaraan: "Mobil",
      deskripsi: "Mobil melaju sangat cepat di area ramai.",
      kontakPelapor: "", status: "Ditolak",
      riwayat: [
        { status: "Diterima", waktu: "2026-11-21T17:12", aktor: "Sistem", keterangan: "Laporan masuk melalui SiLAP Surabaya." },
        { status: "Ditolak", waktu: "2026-11-22T08:30", aktor: "Dishub", keterangan: "Bukti kurang jelas sehingga tidak dapat diverifikasi." }
      ],
      buktiTindakLanjut: ""
    }
  ];

  var STORAGE_KEY = "silap_demo_reports_v1";

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function loadReports() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* file:// or storage disabled: fall back to demo data */ }
    return clone(DEMO_REPORTS);
  }

  function saveReports(list) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* no storage: current page still works */ }
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function categoryLabel(id) {
    var found = KATEGORI.filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }

  function categoryIcon(id) {
    var found = KATEGORI.filter(function (c) { return c.id === id; })[0];
    return iconSvg(found ? found.icon : "info");
  }

  function formatTime(value) {
    if (!value) return "-";
    var d = new Date(value);
    if (isNaN(d.getTime())) return esc(value);
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(d);
  }

  function badge(status) {
    var s = STATUS[status] || { cls: "netral", label: status };
    return '<span class="badge badge-' + esc(s.cls) + '">' + esc(s.label) + "</span>";
  }

  function timeline(report) {
    if (!report.riwayat || !report.riwayat.length) return "";
    return '<ol class="timeline">' + report.riwayat.map(function (ev, i) {
      var latest = i === report.riwayat.length - 1 ? " latest" : "";
      return '<li class="' + latest + '"><b>' + esc(ev.status) + "</b>" +
        '<time>' + formatTime(ev.waktu) + " · " + esc(ev.aktor) + "</time>" +
        (ev.keterangan ? "<p>" + esc(ev.keterangan) + "</p>" : "") + "</li>";
    }).join("") + "</ol>";
  }

  function query(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function fillSelect(id, items) {
    var el = document.getElementById(id);
    if (!el) return;
    items.forEach(function (item) {
      var opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      el.appendChild(opt);
    });
  }

  function setError(input, message) {
    if (!input) return;
    var box = document.querySelector("[data-error-for='" + input.id + "']");
    input.classList.toggle("invalid", !!message);
    if (box) {
      if (!box.id) box.id = "error-" + input.id;
      var described = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (message && described.indexOf(box.id) < 0) described.push(box.id);
      if (!message) described = described.filter(function (id) { return id !== box.id; });
      if (described.length) input.setAttribute("aria-describedby", described.join(" "));
      else input.removeAttribute("aria-describedby");
      box.textContent = message || "";
      box.classList.toggle("show", !!message);
    }
  }

  function showErrors(boxId, errors) {
    var box = document.getElementById(boxId);
    if (!box || !errors.length) return;
    box.innerHTML = '<h2 id="' + boxId + '-title">Periksa kembali isian Anda</h2><ul>' + errors.map(function (err) {
      return '<li><a href="#' + err.id + '">' + esc(err.text) + "</a></li>";
    }).join("") + "</ul>";
    box.classList.remove("hide");
    box.focus();
  }

  function hideErrors() {
    ["step1-error", "step2-error", "form-error"].forEach(function (id) {
      var box = document.getElementById(id);
      if (box) box.classList.add("hide");
    });
  }

  /* ---------- Report form ---------- */
  function initLapor() {
    fillSelect("kecamatan", KECAMATAN);

    var container = document.getElementById("cat-options");
    if (container) {
      container.innerHTML = KATEGORI.map(function (c) {
        return '<label class="cat-option"><input type="radio" id="kategori-' + esc(c.id) + '" name="kategori" value="' + esc(c.id) + '">' + iconSvg(c.icon) + "<span>" + esc(c.label) + "</span></label>";
      }).join("");
    }

    var dateInput = document.getElementById("tanggal");
    var timeInput = document.getElementById("jam");
    if (dateInput && timeInput) {
      var now = new Date();
      var localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.value = localDate;
      timeInput.value = now.toTimeString().slice(0, 5);
    }

    var steps = Array.prototype.slice.call(document.querySelectorAll(".form-step"));
    var indicators = Array.prototype.slice.call(document.querySelectorAll(".stepper-item"));
    var current = 1;

    function showStep(n) {
      current = n;
      steps.forEach(function (el) { el.classList.toggle("hide", Number(el.dataset.step) !== n); });
      indicators.forEach(function (el) {
        var i = Number(el.dataset.step);
        el.classList.toggle("active", i === n);
        el.classList.toggle("done", i < n);
      });
      var panel = document.getElementById("form-panel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      var errors = document.querySelectorAll(".error.show, .invalid");
      Array.prototype.forEach.call(errors, function (e) { e.classList.remove("show", "invalid"); });
      hideErrors();
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-next]"), function (btn) {
      btn.addEventListener("click", function () {
        if (current === 1) {
          var file = document.getElementById("foto").files[0];
          if (!file) {
            setError(document.getElementById("foto"), "Foto bukti wajib diunggah.");
            showErrors("step1-error", [{ id: "foto-label", text: "Pilih atau ambil foto bukti terlebih dahulu." }]);
            return;
          }
          setError(document.getElementById("foto"), "");
        }
        if (current === 2) {
          var problems = [];
          ["kecamatan", "patokan", "tanggal", "jam"].forEach(function (id) {
            var el = document.getElementById(id);
            var bad = !el.value.trim();
            setError(el, bad ? "Field ini wajib diisi." : "");
            if (bad) problems.push({ id: id, text: "Isi " + (el.labels && el.labels[0] ? el.labels[0].textContent.replace("*", "").trim() : id) + "." });
          });
          if (problems.length) { showErrors("step2-error", problems); return; }
        }
        showStep(Math.min(3, current + 1));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-back]"), function (btn) {
      btn.addEventListener("click", function () { showStep(Math.max(1, current - 1)); });
    });

    var foto = document.getElementById("foto");
    if (foto) {
      foto.addEventListener("change", function () {
        var file = foto.files[0];
        var preview = document.getElementById("photo-preview");
        if (!preview) return;
        if (!file) { preview.classList.add("hide"); return; }
        preview.innerHTML = '<img alt="Pratinjau bukti foto"><div class="photo-meta"><span>' + esc(file.name) + "</span><span>" + Math.ceil(file.size / 1024) + " KB</span></div>";
        var img = preview.querySelector("img");
        if (file.type.indexOf("image/") === 0) img.src = URL.createObjectURL(file);
        else img.alt = "File bukan gambar";
        preview.classList.remove("hide");
        setError(foto, "");
      });
    }

    var form = document.getElementById("lapor-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var kategori = form.querySelector('input[name="kategori"]:checked');
      var consent = document.getElementById("setuju");
      var problems = [];
      if (!kategori) problems.push({ id: "kategori-lampu-merah", text: "Pilih kategori pelanggaran." });
      ["plat", "deskripsi"].forEach(function (id) {
        var el = document.getElementById(id);
        var bad = !el.value.trim();
        setError(el, bad ? "Field ini wajib diisi." : "");
        if (bad) problems.push({ id: id, text: "Isi " + (el.labels && el.labels[0] ? el.labels[0].textContent.replace("*", "").trim() : id) + "." });
      });
      if (consent && !consent.checked) problems.push({ id: "setuju", text: "Centang pernyataan kebenaran laporan." });
      if (problems.length) { showErrors("form-error", problems); return; }
      hideErrors();

      var reports = loadReports();
      var maxNumber = 0;
      reports.forEach(function (r) {
        var n = parseInt(String(r.kode).split("-").pop(), 10);
        if (!isNaN(n) && n > maxNumber) maxNumber = n;
      });
      var kode = "SILAP-2026-" + String(maxNumber + 1).padStart(6, "0");
      var fotoName = (document.getElementById("foto").files[0] || {}).name || "bukti.jpg";
      var record = {
        kode: kode,
        kategori: kategori.value,
        fotoNama: fotoName,
        kecamatan: document.getElementById("kecamatan").value,
        patokan: document.getElementById("patokan").value.trim(),
        waktu: document.getElementById("tanggal").value + "T" + document.getElementById("jam").value,
        plat: document.getElementById("plat").value.trim().toUpperCase(),
        jenisKendaraan: document.getElementById("jenis").value,
        deskripsi: document.getElementById("deskripsi").value.trim(),
        kontakPelapor: document.getElementById("kontak").value.trim(),
        status: "Diterima",
        riwayat: [{ status: "Diterima", waktu: new Date().toISOString().slice(0, 16), aktor: "Sistem", keterangan: "Laporan masuk melalui SiLAP Surabaya." }],
        buktiTindakLanjut: ""
      };
      reports.unshift(record);
      saveReports(reports);

      document.getElementById("success-code").textContent = kode;
      document.getElementById("success-link").href = "status.html?kode=" + encodeURIComponent(kode);
      document.getElementById("form-wrap").classList.add("hide");
      document.getElementById("success-panel").classList.remove("hide");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    var copyBtn = document.getElementById("copy-code");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var text = document.getElementById("success-code").textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { copyBtn.textContent = "Kode tersalin"; });
        else copyBtn.textContent = text;
      });
    }
  }

  /* ---------- Status lookup ---------- */
  function initStatus() {
    var reports = loadReports();
    var chips = document.getElementById("demo-chips");
    if (chips) {
      chips.innerHTML = reports.slice(0, 4).map(function (r) {
        return '<button type="button" class="demo-chip" data-kode="' + esc(r.kode) + '">' + esc(r.kode) + "</button>";
      }).join("");
      chips.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-kode]");
        if (!chip) return;
        var input = document.getElementById("kode");
        input.value = chip.dataset.kode;
        setError(input, "");
        render(input.value.trim());
      });
    }

    var form = document.getElementById("status-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("kode");
        if (!input.value.trim()) { setError(input, "Masukkan kode laporan."); return; }
        setError(input, "");
        render(input.value.trim());
      });
    }

    function render(rawCode) {
      var code = rawCode.toUpperCase().replace(/\s+/g, "");
      var result = document.getElementById("status-result");
      var empty = document.getElementById("status-empty");
      if (!result || !empty) return;
      var report = loadReports().filter(function (r) { return r.kode.toUpperCase() === code; })[0];
      if (!report) {
        result.classList.add("hide");
        empty.classList.remove("hide");
        empty.innerHTML = '<div class="notice notice-error">' + iconSvg("warning") + "<span>Kode <strong>" + esc(rawCode) + "</strong> tidak ditemukan. Periksa kembali kode laporan Anda.</span></div>";
        return;
      }
      empty.classList.add("hide");
      result.classList.remove("hide");
      document.getElementById("status-kode").textContent = report.kode;
      document.getElementById("status-badge").innerHTML = badge(report.status);
      document.getElementById("status-kategori").innerHTML = categoryIcon(report.kategori) + " <span>" + esc(categoryLabel(report.kategori)) + "</span>";
      document.getElementById("status-lokasi").textContent = report.kecamatan + " — " + report.patokan;
      document.getElementById("status-waktu").textContent = formatTime(report.waktu);
      document.getElementById("status-plat").textContent = report.plat;
      document.getElementById("status-deskripsi").textContent = report.deskripsi;
      document.getElementById("status-timeline").innerHTML = timeline(report);
      var proof = document.getElementById("status-proof");
      if (report.buktiTindakLanjut) {
        proof.classList.remove("hide");
        proof.innerHTML = '<h3>Bukti tindak lanjut pemerintah</h3><div class="notice notice-success">' + iconSvg("check") + "<span>" + esc(report.buktiTindakLanjut) + "</span></div>";
      } else {
        proof.classList.add("hide");
      }
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    var initial = query("kode");
    if (initial) {
      document.getElementById("kode").value = initial;
      render(initial);
    }
  }

  /* ---------- Officer dashboard ---------- */
  function initPetugas() {
    var selected = null;
    var filter = "Semua";

    function stats(reports) {
      var counts = { Diterima: 0, Diverifikasi: 0, Ditindaklanjuti: 0, Selesai: 0 };
      reports.forEach(function (r) { if (counts[r.status] != null) counts[r.status]++; });
      var boxes = [
        ["Total laporan", reports.length, "", "list"],
        ["Diterima", counts.Diterima, "Diterima", "document"],
        ["Diverifikasi", counts.Diverifikasi, "Diverifikasi", "shield"],
        ["Selesai / ditindaklanjuti", counts.Selesai + counts.Ditindaklanjuti, "Selesai", "check"]
      ];
      var el = document.getElementById("stats");
      if (el) el.innerHTML = boxes.map(function (b) {
        return '<div class="card stat"><span class="row" style="gap:8px">' + iconSvg(b[3]) + "<span>" + esc(b[0]) + "</span></span><b>" + b[1] + "</b>" +
          (b[2] ? badge(b[2]) : "") + "</div>";
      }).join("");
    }

    function renderList() {
      var reports = loadReports();
      stats(reports);
      var shown = filter === "Semua" ? reports : reports.filter(function (r) { return r.status === filter; });
      var list = document.getElementById("report-list");
      if (!list) return;
      if (!shown.length) {
        list.innerHTML = '<div class="empty">Tidak ada laporan dengan status ini.</div>';
      } else {
        list.innerHTML = shown.map(function (r) {
          return '<article class="report-row' + (selected === r.kode ? " selected" : "") + '" data-kode="' + esc(r.kode) + '" tabindex="0">' +
            '<div class="report-row-head"><h3>' + categoryIcon(r.kategori) + " " + esc(categoryLabel(r.kategori)) + "</h3>" + badge(r.status) + "</div>" +
            '<div class="meta">' + esc(r.kode) + " · " + esc(r.kecamatan) + " · " + formatTime(r.waktu) + "</div>" +
            "</article>";
        }).join("");
      }
      if (!selected || !reports.some(function (r) { return r.kode === selected; })) selected = reports.length ? reports[0].kode : null;
      renderDetail();
    }

    function renderDetail() {
      var panel = document.getElementById("detail-content");
      if (!panel) return;
      var report = loadReports().filter(function (r) { return r.kode === selected; })[0];
      if (!report) { panel.innerHTML = '<div class="empty">Pilih laporan untuk melihat detail.</div>'; return; }
      var kv = [
        ["Kode", esc(report.kode)], ["Status", ""], ["Kategori", categoryIcon(report.kategori) + " <span>" + esc(categoryLabel(report.kategori)) + "</span>"],
        ["Lokasi", esc(report.kecamatan + " — " + report.patokan)], ["Waktu kejadian", esc(formatTime(report.waktu))],
        ["Plat kendaraan", esc(report.plat + " (" + report.jenisKendaraan + ")")], ["Bukti foto", esc(report.fotoNama)],
        ["Kontak pelapor", esc(report.kontakPelapor || "Anonim")]
      ];
      panel.innerHTML =
        '<div class="row" style="justify-content:space-between"><h3 style="margin:0">Detail laporan</h3>' + badge(report.status) + "</div>" +
        '<hr class="divider">' +
        '<div class="kv">' + kv.map(function (item) {
          return '<div class="kv-item"><span>' + esc(item[0]) + "</span><strong>" + (item[1] === "" ? badge(report.status) : item[1]) + "</strong></div>";
        }).join("") + "</div>" +
        '<hr class="divider"><p class="small muted">Deskripsi pelapor</p><p>' + esc(report.deskripsi) + "</p>" +
        '<h3>Riwayat penanganan</h3>' + timeline(report) + actionBox(report);
      bindActions(report);
    }

    function actionBox(report) {
      var actions = {
        Diterima: [["Diverifikasi", "verify", "Verifikasi (Dishub)"], ["Ditolak", "reject", "Tolak (Dishub)"]],
        Diverifikasi: [["Ditindaklanjuti", "act", "Tindaklanjuti (Polrestabes)"], ["Ditolak", "reject", "Tolak (Dishub)"]],
        Ditindaklanjuti: [["Selesai", "close", "Selesaikan (Polrestabes)"]],
        Selesai: [], Ditolak: []
      }[report.status] || [];
      if (!actions.length) return '<div class="notice notice-info">' + iconSvg("info") + "<span>Laporan sudah berstatus akhir dan tidak dapat diubah lagi.</span></div>";
      return '<div class="action-box"><h3>Ubah status</h3><div class="action-buttons">' +
        actions.map(function (a) { return '<button type="button" class="btn btn-sm ' + (a[1] === "reject" ? "btn-outline" : "btn-primary") + '" data-action="' + a[1] + '" data-status="' + a[0] + '">' + esc(a[2]) + "</button>"; }).join("") +
        '</div><div id="action-form" class="hide" style="margin-top:12px"><label class="field-label" for="action-note" id="action-label">Keterangan</label><textarea class="textarea" id="action-note" rows="3"></textarea><div class="row" style="margin-top:10px"><button type="button" class="btn btn-primary btn-sm" id="action-save">Simpan perubahan</button><button type="button" class="btn btn-outline btn-sm" id="action-cancel">Batal</button></div></div></div>';
    }

    function bindActions(report) {
      var pending = null;
      Array.prototype.forEach.call(document.querySelectorAll("[data-action]"), function (btn) {
        btn.addEventListener("click", function () {
          pending = { action: btn.dataset.action, status: btn.dataset.status };
          var box = document.getElementById("action-form");
          var label = document.getElementById("action-label");
          label.textContent = pending.action === "reject" ? "Alasan penolakan (wajib)" : "Bukti/keterangan tindak lanjut (wajib)";
          document.getElementById("action-note").value = "";
          box.classList.remove("hide");
          document.getElementById("action-note").focus();
        });
      });
      var cancel = document.getElementById("action-cancel");
      if (cancel) cancel.addEventListener("click", function () { document.getElementById("action-form").classList.add("hide"); });
      var save = document.getElementById("action-save");
      if (save) save.addEventListener("click", function () {
        var note = document.getElementById("action-note").value.trim();
        if (!note) { document.getElementById("action-note").classList.add("invalid"); return; }
        var lists = loadReports();
        var index = -1;
        lists.forEach(function (r, i) { if (r.kode === selected) index = i; });
        if (index < 0) return;
        var actor = pending.action === "verify" || pending.action === "reject" ? "Dishub" : "Polrestabes Surabaya";
        lists[index].status = pending.status;
        lists[index].riwayat.push({ status: pending.status, waktu: new Date().toISOString().slice(0, 16), aktor: actor, keterangan: note });
        if (pending.action !== "reject") lists[index].buktiTindakLanjut = note;
        saveReports(lists);
        renderList();
      });
    }

    var list = document.getElementById("report-list");
    if (list) {
      list.addEventListener("click", function (e) {
        var row = e.target.closest("[data-kode]");
        if (row) { selected = row.dataset.kode; renderList(); }
      });
      list.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var row = e.target.closest("[data-kode]");
        if (row) { e.preventDefault(); selected = row.dataset.kode; renderList(); }
      });
    }
    var filters = document.getElementById("filters");
    if (filters) {
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        filter = btn.dataset.filter;
        Array.prototype.forEach.call(filters.querySelectorAll("[data-filter]"), function (b) { b.classList.toggle("active", b === btn); });
        renderList();
      });
    }
    renderList();
  }

  document.addEventListener("DOMContentLoaded", function () {
    hydrateIcons();
    var page = document.body.dataset.page;
    if (page === "lapor") initLapor();
    else if (page === "status") initStatus();
    else if (page === "petugas") initPetugas();
  });
})();
