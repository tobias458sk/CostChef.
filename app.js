// =====================
// DOM ELEMENTY
// =====================
const ingName = document.getElementById("ingName");
const ingPrice = document.getElementById("ingPrice");
const ingGrams = document.getElementById("ingGrams");
const ingredientsList = document.getElementById("ingredientsList");

const mealName = document.getElementById("mealName");
const mealPrice = document.getElementById("mealPrice");
const mealsList = document.getElementById("mealsList");

const mealSelect = document.getElementById("mealSelect");
const ingredientCheckboxList = document.getElementById("ingredientCheckboxList");

// =====================
// DATA
// =====================
let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// =====================
// ULOŽENIE
// =====================
function saveData() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  localStorage.setItem("meals", JSON.stringify(meals));
}

// =====================
// VYMAZAŤ VŠETKO
// =====================
function clearAll() {
  if (confirm("Naozaj chceš vymazať všetko?")) {
    ingredients = [];
    meals = [];
    localStorage.removeItem("ingredients");
    localStorage.removeItem("meals");
    renderAll();
  }
}

// =====================
// PRIDAŤ INGREDIENCIU
// =====================
function addIngredient() {
  const name = ingName.value.trim();
  const price = parseFloat(ingPrice.value);
  const grams = parseFloat(ingGrams.value);

  if (!name || isNaN(price) || isNaN(grams) || price <= 0 || grams <= 0) {
    alert("Vyplň všetko správne");
    return;
  }

  ingredients.push({ name, price, grams });
  saveData();
  renderAll();

  ingName.value = "";
  ingPrice.value = "";
  ingGrams.value = "";
}

// =====================
// PRIDAŤ JEDLO
// =====================
function addMeal() {
  const name = mealName.value.trim();
  const price = parseFloat(mealPrice.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Vyplň všetko správne");
    return;
  }

  meals.push({ name, price, ingredients: [] });
  saveData();
  renderAll();

  mealName.value = "";
  mealPrice.value = "";
}

// =====================
// PRIDAŤ OZNAČENÉ SUROVINY
// =====================
function addSelectedIngredients() {
  const mealIndex = mealSelect.value;

  if (mealIndex === "") {
    alert("Vyber jedlo");
    return;
  }

  const checked = document.querySelectorAll("#ingredientCheckboxList input:checked");

  if (checked.length === 0) {
    alert("Označ aspoň jednu surovinu");
    return;
  }

  checked.forEach(cb => {
    const ingIndex = parseInt(cb.value);
    const grams = ingredients[ingIndex].grams;

    meals[mealIndex].ingredients.push({ ingIndex, grams });
    cb.checked = false;
  });

  saveData();
  renderAll();
}

// =====================
// RENDER VŠETKO
// =====================
function renderAll() {
  renderIngredients();
  renderMeals();
  renderSelects();
}

// =====================
// INGREDIENCIE LIST
// =====================
function renderIngredients() {
  ingredientsList.innerHTML = "";

  ingredients.forEach((ing, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${ing.name} — ${ing.price.toFixed(2)} €/kg | ${ing.grams} g
      <button class="danger-small" onclick="removeIngredient(${i})">❌</button>
    `;
    ingredientsList.appendChild(li);
  });
}

// =====================
// JEDLÁ LIST + VÝPOČTY
// =====================
function renderMeals() {
  mealsList.innerHTML = "";

  meals.forEach((meal, i) => {
    let total = 0;
    let text = "";

    meal.ingredients.forEach(item => {
      const ing = ingredients[item.ingIndex];
      if (!ing) return;

      const cost = (ing.price / 1000) * item.grams;
      total += cost;

      text += `${ing.name} (${item.ingIndex}g), `;
    });

    text = text.slice(0, -2);

    const profit = meal.price - total;
    const margin = meal.price > 0 ? (profit / meal.price) * 100 : 0;
    const lossClass = profit < 0 ? "loss" : "";

    const li = document.createElement("li");
    li.className = lossClass;
    li.innerHTML = `
      <strong>${meal.name}</strong><br>
      Predaj: ${meal.price.toFixed(2)} €<br>
      Náklady: ${total.toFixed(2)} €<br>
      Ingrediencie: ${text || "žiadne"}<br>
      <b>Zisk: ${profit.toFixed(2)} € | Marža: ${margin.toFixed(1)} %</b>
      <button class="danger-small" onclick="removeMeal(${i})">❌</button>
    `;
    mealsList.appendChild(li);
  });
}

// =====================
// SELECT + CHECKBOXY
// =====================
function renderSelects() {
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingredientCheckboxList.innerHTML = "";

  meals.forEach((m, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = m.name;
    mealSelect.appendChild(option);
  });

  ingredients.forEach((ing, i) => {
    const label = document.createElement("label");
    label.className = "checkbox-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;

    const span = document.createElement("span");
    span.textContent = `${ing.name} (${ing.grams}g | ${ing.price.toFixed(2)} €/kg)`;

    label.appendChild(checkbox);
    label.appendChild(span);
    ingredientCheckboxList.appendChild(label);
  });
}

// =====================
// MAZANIE INGREDIENCIE
// =====================
function removeIngredient(i) {
  ingredients.splice(i, 1);
  saveData();
  renderAll();
}

// =====================
// MAZANIE JEDLA
// =====================
function removeMeal(i) {
  meals.splice(i, 1);
  saveData();
  renderAll();
}

// =====================
// INIT
// =====================
renderAll();

function showApp() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("recipesPage").style.display = "none";
  document.getElementById("appContent").style.display = "block";
}

function showRecipes() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("appContent").style.display = "none";
  document.getElementById("recipesPage").style.display = "flex";
}

function goHome() {
  document.getElementById("appContent").style.display = "none";
  document.getElementById("recipesPage").style.display = "none";
  document.getElementById("welcomeScreen").style.display = "flex";
}
