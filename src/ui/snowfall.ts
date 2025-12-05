function addSnowfall() {
  const snowfall = document.createElement("div");
  snowfall.className = "snowfall";
  document.body.prepend(snowfall);

  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
  let cssRules = "";

  for (let i = 0; i < 100; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowfall.append(snowflake);

    cssRules += `
        .snowflake:nth-child(${i + 1}) {
            left: ${Math.random() * 100}%;
            animation-delay: ${1 + 0.5 * i}s;
        }`;
  }

  styleSheet.textContent = cssRules;
}

export default addSnowfall;
