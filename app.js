let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// Uloženie do localStorage
function saveData() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  localStorage.setItem("meals", JSON.stringify(meals));
}

// LOGIN
function checkCode() {
  const code = document.getElementById("code").value;
  if (code === "1234") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    alert("Zlý kód!");
  }
}

// RESET všetkého
function resetAll() {
  if (confirm("Naozaj chceš všetko vymazať?")) {
    localStorage.clear();
    ingredients = [];
    meals = [];
    renderAll();
  }
}

// PRIDAŤ INGREDIENCIU
function addIngredient() {
  const name = ingName.value.trim();
  const price = parseFloat(ingPrice.value);
  const grams = parseFloat(ingGrams.value);

  if (!name || isNaN(price) || isNaN(grams)) return alert("Vyplň všetko");

  ingredients.push({ name, price, grams });
  saveData();
  renderAll();

  ingName.value = "";
  ingPrice.value = "";
  ingGrams.value = "";
}

// PRIDAŤ JEDLO
function addMeal() {
  const name = mealName.value.trim();
  const price = parseFloat(mealPrice.value);

  if (!name || isNaN(price)) return alert("Vyplň všetko");

  meals.push({ name, price, ingredients: [] });
  saveData();
  renderAll();

  mealName.value = "";
  mealPrice.value = "";
}

// PRIDAŤ VIAC INGREDIENCIÍ K JEDLU NARAZ
function addIngredientToMeal() {
  const mealIndex = mealSelect.value;
  const selectedOptions = Array.from(ingSelect.selectedOptions); // všetky vybrané ingrediencie

  if (mealIndex === "" || selectedOptions.length === 0) {
    return alert("Vyber jedlo aj ingrediencie!");
  }

  selectedOptions.forEach(option => {
    const ingIndex = option.value;
    const grams = ingredients[ingIndex].grams; // berie gramáž z ingrediencie
    meals[mealIndex].ingredients.push({ ingIndex, grams });
  });

  saveData();
  renderAll();
  ingSelect.selectedIndex = -1; // odznačí všetky vybrané ingrediencie
}

// RENDER VŠETKÉHO
function renderAll() {
  renderIngredients();
  renderMeals();
  renderSelects();
}

// ZOBRAZIŤ INGREDIENCIE
function renderIngredients() {
  ingredientsList.innerHTML = "";
  ingredients.forEach((ing, index) => {
    ingredientsList.innerHTML += `
      <li>
        ${ing.name} - ${ing.price.toFixed(2)} € / kg | ${ing.grams} g na porciu
        <button onclick="ingredients.splice(${index},1);saveData();renderAll();">❌</button>
      </li>
    `;
  });
}

// ZOBRAZIŤ JEDLÁ
function renderMeals() {
  mealsList.innerHTML = "";
  meals.forEach((meal, index) => {
    let total = 0;
    let ingredientsText = "";

    meal.ingredients.forEach(item => {
      const ing = ingredients[item.ingIndex];
      total += (ing.price / 1000) * item.grams;
      ingredientsText += `${ing.name} (${item.grams}g), `;
    });
    ingredientsText = ingredientsText.slice(0, -2);

    const profit = meal.price - total;
    const margin = meal.price ? (profit / meal.price) * 100 : 0;

    let color = "#00b894";
    if (margin < 60) color = "#fdcb6e";
    if (margin < 40) color = "#d63031";

    mealsList.innerHTML += `
      <li>
        <strong>${meal.name}</strong><br>
        Predaj: ${meal.price.toFixed(2)} €<br>
        Náklady: ${total.toFixed(2)} €<br>
        Ingrediencie: ${ingredientsText || "Žiadne"}<br>
        <div style="color:${color};font-weight:bold;font-size:18px;">
          Zisk: ${profit.toFixed(2)} € | Marža: ${margin.toFixed(1)} %
        </div>
        <button onclick="meals.splice(${index},1);saveData();renderAll();">❌</button>
      </li>
    `;
  });
}

// RENDER SELECTOV PRE PRIDANIE INGREDIENCIÍ
function renderSelects() {
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingSelect.innerHTML = '';

  meals.forEach((m, i) => {
    mealSelect.innerHTML += `<option value="${i}">${m.name}</option>`;
  });

  ingredients.forEach((ing, i) => {
    ingSelect.innerHTML += `<option value="${i}">${ing.name}</option>`;
  });
}

// INITIAL RENDER
renderAll();
