let meals = JSON.parse(localStorage.getItem("meals")) || [];

// Uloženie
function saveData() {
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

// RESET
function resetAll() {
  if (confirm("Naozaj chceš všetko vymazať?")) {
    localStorage.clear();
    meals = [];
    renderMeals();
  }
}

// PRIDAŤ ĎALŠIU INGREDIENCIU DO FORMULÁRA
function addIngredientRow() {
  const container = document.getElementById("ingredientInputs");
  const div = document.createElement("div");
  div.className = "ingredientRow";
  div.innerHTML = `
    <input class="ingName" placeholder="Názov ingrediencie">
    <input class="ingPrice" type="number" step="0.01" placeholder="Cena za kilo €">
    <input class="ingGrams" type="number" step="1" placeholder="Gramy na porciu">
  `;
  container.appendChild(div);
}

// PRIDAŤ JEDLO S INGREDIENCAMI NARAZ
function addMealWithIngredients() {
  const name = mealName.value.trim();
  if (!name) return alert("Zadaj názov jedla!");

  const ingredientRows = document.querySelectorAll(".ingredientRow");
  const ingredients = [];
  let totalCost = 0;

  ingredientRows.forEach(row => {
    const ingName = row.querySelector(".ingName").value.trim();
    const ingPrice = parseFloat(row.querySelector(".ingPrice").value);
    const ingGrams = parseFloat(row.querySelector(".ingGrams").value);

    if (!ingName || isNaN(ingPrice) || isNaN(ingGrams)) return;

    const cost = (ingPrice / 1000) * ingGrams;
    totalCost += cost;

    ingredients.push({ name: ingName, price: ingPrice, grams: ingGrams });
  });

  if (ingredients.length === 0) return alert("Pridaj aspoň jednu ingredienciu!");

  // Odporúčaná cena pre 80% maržu
  const recommendedPrice = (totalCost / 0.2).toFixed(2);

  meals.push({ name, ingredients, totalCost, recommendedPrice });
  saveData();
  renderMeals();

  // reset formulára
  mealName.value = "";
  document.getElementById("ingredientInputs").innerHTML = `
    <div class="ingredientRow">
      <input class="ingName" placeholder="Názov ingrediencie">
      <input class="ingPrice" type="number" step="0.01" placeholder="Cena za kilo €">
      <input class="ingGrams" type="number" step="1" placeholder="Gramy na porciu">
    </div>
  `;
}

// RENDER JEDÁL
function renderMeals() {
  const mealsList = document.getElementById("mealsList");
  mealsList.innerHTML = "";

  meals.forEach((meal, index) => {
    let ingredientsText = meal.ingredients.map(i => `${i.name} (${i.grams}g)`).join(", ");
    mealsList.innerHTML += `
      <li>
        <strong>${meal.name}</strong><br>
        Ingrediencie: ${ingredientsText}<br>
        Náklady: ${meal.totalCost.toFixed(2)} €<br>
        Odporúčaná cena pre 80% maržu: ${meal.recommendedPrice} €<br>
        <button onclick="meals.splice(${index},1);saveData();renderMeals();">❌ Vymazať</button>
      </li>
    `;
  });
}

// INITIAL RENDER
renderMeals();
