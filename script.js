(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = "skilldna-demo-v1";
  const defaults = {
    name: "Student Account",
    goal: "web",
    learningProgress: 45,
    skills: {
      "JavaScript": 78,
      "Problem solving": 72,
      "SQL & databases": 58,
      "Communication": 81,
      "Data analysis": 45
    },
    milestones: [true, false, false, false],
    lightTheme: false
  };

  let state = loadState();
  let toastTimer;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || typeof saved !== "object") return structuredClone(defaults);
      return {
        ...structuredClone(defaults),
        ...saved,
        skills: { ...defaults.skills, ...(saved.skills || {}) },
        milestones: Array.isArray(saved.milestones) && saved.milestones.length === 4
          ? saved.milestones.map(Boolean) : [...defaults.milestones]
      };
    } catch {
      return structuredClone(defaults);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      showToast("Changes apply for this session, but browser storage is unavailable.");
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  const careers = {
    web: {
      title: "Junior Web Developer",
      description: "Build on your JavaScript and problem-solving strengths while improving database and portfolio skills.",
      skills: ["JavaScript", "Problem solving", "SQL & databases"],
      base: 20
    },
    data: {
      title: "Junior Data Analyst",
      description: "Develop your analytical thinking with SQL practice, spreadsheet skills, and beginner data projects.",
      skills: ["Data analysis", "SQL & databases", "Problem solving"],
      base: 15
    },
    ux: {
      title: "UX/UI Designer",
      description: "Use communication and problem solving as a foundation while learning user research and design tools.",
      skills: ["Communication", "Problem solving", "Data analysis"],
      base: 18
    }
  };

  function getCareerScore(key) {
    const role = careers[key];
    const average = role.skills.reduce((sum, skill) => sum + Number(state.skills[skill] || 0), 0) / role.skills.length;
    return Math.max(35, Math.min(96, Math.round(average * 0.78 + role.base)));
  }

  function getBestCareer() {
    const goalScore = getCareerScore(state.goal);
    return { key: state.goal, score: goalScore, ...careers[state.goal] };
  }

  function updateSkillsUI() {
    $$("#skillList input[type='range']").forEach(input => {
      const skill = input.dataset.skill;
      const value = Number(state.skills[skill] ?? input.value);
      input.value = String(value);
      $(".skill-value", input.closest(".skill-row")).textContent = `${value}%`;
      input.style.background = `linear-gradient(90deg, #9e8bff ${value}%, #29334b ${value}%)`;
    });
  }

  function renderInsights() {
    const values = Object.values(state.skills).map(Number);
    const average = values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
    const growthAreas = Object.entries(state.skills).filter(([, value]) => Number(value) < 60).sort((a, b) => a[1] - b[1]);
    const best = getBestCareer();
    const completed = state.milestones.filter(Boolean).length;
    const assessed = values.filter(value => value > 0).length;

    $("#assessedCount").innerHTML = `${assessed} <small>/ 12</small>`;
    $("#readinessScore").innerHTML = `${Math.round(average)}<small>%</small>`;
    $("#gapCount").textContent = String(growthAreas.length);
    $("#learningProgress").innerHTML = `${Math.round(completed / 4 * 100)}<small>%</small>`;
    $(".blue-progress span").style.width = `${completed / 4 * 100}%`;
    $("#careerMatchTitle").textContent = best.title;
    $("#careerMatchDescription").textContent = best.description;
    $("#matchPercent").textContent = `${best.score}%`;
    $("#matchBar").style.width = `${best.score}%`;
    $("#focusSkill").textContent = growthAreas[0]?.[0] || "Portfolio project";
    $("#focusReason").textContent = growthAreas.length
      ? "Prioritize this skill with focused practice."
      : "Keep your skills sharp with a practical project.";
    $("#roadmapPercent").textContent = `${completed} of 4`;
    $$("[data-career]").forEach(chip => {
      chip.textContent = `${getCareerScore(chip.dataset.career)}% match`;
    });
    updateSkillsUI();
  }

  function renderProfile() {
    const name = state.name.trim() || "Student Account";
    $("#sidebarName").textContent = name;
    const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    $$(".avatar").forEach(avatar => avatar.textContent = initials || "SA");
    $("#nameInput").value = state.name === "Student Account" ? "" : state.name;
    $("#goalSelect").value = state.goal;
    document.body.classList.toggle("light-theme", Boolean(state.lightTheme));
  }

  function renderRoadmap() {
    $$(".roadmap-step").forEach((step, index) => {
      const checkbox = $("input[type='checkbox']", step);
      checkbox.checked = Boolean(state.milestones[index]);
      step.classList.toggle("completed", checkbox.checked);
      $(".step-check", step).textContent = checkbox.checked ? "✓" : String(index + 1);
    });
  }

  function openProfile() {
    if (typeof $("#profileModal").showModal === "function") {
      $("#profileModal").showModal();
    } else {
      showToast("Profile editing is not supported by this browser.");
    }
  }

  $("#profileButton").addEventListener("click", openProfile);
  $("#editProfileButton").addEventListener("click", openProfile);

  $("#profileForm").addEventListener("submit", event => {
    if (event.submitter?.value !== "save") return;
    event.preventDefault();
    state.name = $("#nameInput").value.trim().slice(0, 50) || "Student Account";
    state.goal = $("#goalSelect").value in careers ? $("#goalSelect").value : "web";
    saveState();
    renderProfile();
    renderInsights();
    $("#profileModal").close();
    showToast("Profile updated successfully.");
  });

  $$("#skillList input[type='range']").forEach(input => {
    input.addEventListener("input", () => {
      state.skills[input.dataset.skill] = Number(input.value);
      $(".skill-value", input.closest(".skill-row")).textContent = `${input.value}%`;
      input.style.background = `linear-gradient(90deg, #9e8bff ${input.value}%, #29334b ${input.value}%)`;
    });
    input.addEventListener("change", () => {
      saveState();
      renderInsights();
    });
  });

  $("#recalculateButton").addEventListener("click", () => {
    saveState();
    renderInsights();
    showToast("Skill insights recalculated from your current scores.");
  });

  $$(".roadmap-step input[type='checkbox']").forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      state.milestones[index] = checkbox.checked;
      saveState();
      renderRoadmap();
      renderInsights();
      showToast(checkbox.checked ? "Milestone marked complete." : "Milestone reopened.");
    });
  });

  $$("[data-role]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.role;
      state.goal = key;
      saveState();
      renderProfile();
      renderInsights();
      showToast(`${careers[key].title} selected as your demo career goal.`);
      $("#roadmap").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  $("#themeButton").addEventListener("click", () => {
    state.lightTheme = !state.lightTheme;
    saveState();
    renderProfile();
    showToast(state.lightTheme ? "Light theme enabled." : "Dark theme enabled.");
  });

  $("#menuButton").addEventListener("click", () => {
    const sidebar = $("#sidebar");
    const isOpen = sidebar.classList.toggle("open");
    $("#menuButton").setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
      $$(".nav-item").forEach(item => item.classList.toggle("active", item === link));
      $("#sidebar").classList.remove("open");
      $("#menuButton").setAttribute("aria-expanded", "false");
    });
  });

  $("#year").textContent = new Date().getFullYear();
  renderProfile();
  renderRoadmap();
  renderInsights();
})();
