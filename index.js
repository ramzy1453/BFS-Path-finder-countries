async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getCountryByCca3(countries, cca3) {
  return countries.find((country) => country.cca3 === cca3);
}

function cca2ToCca3(countries, cca2) {
  const country = countries.find((country) => country.cca2 === cca2);
  return country.cca3;
}

function cca3ToCca2(countries, cca3) {
  const country = countries.find((country) => country.cca3 === cca3);
  return country.cca2;
}

function pathToCountry(countries, firstCountry, secondCountry) {
  if (!firstCountry || !secondCountry) {
    return "Country not found";
  }

  const visited = [];
  const queue = [firstCountry];
  while (queue.length > 0) {
    const currentCca3 = queue.shift();
    const currentCountry = getCountryByCca3(countries, currentCca3);
    if (currentCca3 === secondCountry) {
      return visited;
    }
    if (!visited.includes(currentCca3)) {
      visited.push(currentCca3);
      queue.push(...currentCountry.borders);
    }
  }
}

function renderCountries(path, countries) {
  const countriesElement = document.getElementById("countries");
  countriesElement.childNodes.forEach((child) => {
    if (child.style) {
      child.style.fill = "#D3D3D3";
      if (
        path
          .map((cr) => cca3ToCca2(countries, cr))
          .includes(child.getAttribute("data-id"))
      ) {
        child.style.fill = "red";
      }
    }
  });
}

async function main() {
  const countries = await getCountries();
  var countryElements = document.getElementById("countries").childNodes;
  var countryCount = countryElements.length;
  for (var i = 0; i < countryCount; i++) {
    countryElements[i].onclick = function () {
      const cca3 = cca2ToCca3(countries, this.getAttribute("data-id"));
      const path = pathToCountry(countries, "DZA", cca3);

      renderCountries(path, countries);
    };
  }
}

main();
