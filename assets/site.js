document.addEventListener("DOMContentLoaded", () => {
  const pathName = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
  const currentPage = pathName.split("/").pop() || "index";
  const isPage = (name) =>
    currentPage === name || currentPage === `${name}.html`;

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const message = document.getElementById("msg")?.value || "";
      const statusNode = document.querySelector(".form-status");

      if (!name || !email || !message) {
        if (statusNode) {
          statusNode.textContent = "Please fill in all fields.";
          statusNode.style.color = "#b91c1c";
        }
        return;
      }

      if (statusNode) {
        statusNode.textContent = "Sending...";
        statusNode.style.color = "#1d4ed8";
      }

      try {
        const response = await fetch("https://formspree.io/f/heheh", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
          contactForm.reset();
          if (statusNode) {
            statusNode.textContent = "Message sent successfully.";
            statusNode.style.color = "#0f9d6c";
          }
        } else if (statusNode) {
          statusNode.textContent =
            "Unable to send message right now. Please try again.";
          statusNode.style.color = "#b91c1c";
        }
      } catch (error) {
        if (statusNode) {
          statusNode.textContent =
            "Unable to send message right now. Please try again.";
          statusNode.style.color = "#b91c1c";
        }
      }
    });
  }

  const setResult = (node, html) => {
    if (!node) return;
    node.innerHTML = html;
    node.classList.add("show");
  };

  const attachCalcForm = (tool, handler) => {
    const form = document.querySelector(`form[data-page="${tool}"]`);
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
    });
  };

  if (isPage("age-calculator")) {
    attachCalcForm("age-calculator", () => {
      const dob = new Date(document.getElementById("dob").value);
      const result = document.getElementById("r");
      if (isNaN(dob)) {
        setResult(result, "<p>Please select your date of birth.</p>");
        return;
      }

      let at = document.getElementById("at").value
        ? new Date(document.getElementById("at").value)
        : new Date();
      let y = at.getFullYear() - dob.getFullYear();
      let m = at.getMonth() - dob.getMonth();
      let d = at.getDate() - dob.getDate();

      if (d < 0) {
        m--;
        d += new Date(at.getFullYear(), at.getMonth(), 0).getDate();
      }
      if (m < 0) {
        y--;
        m += 12;
      }

      const days = Math.floor((at - dob) / 864e5);
      let nb = new Date(at.getFullYear(), dob.getMonth(), dob.getDate());
      if (nb <= at)
        nb = new Date(at.getFullYear() + 1, dob.getMonth(), dob.getDate());
      const bd = Math.ceil((nb - at) / 864e5);

      setResult(
        result,
        '<div class="big">' +
          y +
          " years, " +
          m +
          " months, " +
          d +
          " days</div><ul><li><span>Total months</span><b>" +
          (y * 12 + m) +
          "</b></li><li><span>Total weeks</span><b>" +
          Math.floor(days / 7) +
          "</b></li><li><span>Total days</span><b>" +
          days +
          "</b></li><li><span>Total hours</span><b>" +
          (days * 24).toLocaleString() +
          "</b></li><li><span>Next birthday in</span><b>" +
          bd +
          " days 🎉</b></li></ul>",
      );
    });
  }

  if (isPage("bmi-calculator")) {
    attachCalcForm("bmi-calculator", () => {
      const h = +document.getElementById("h").value / 100;
      const w = +document.getElementById("w").value;
      const result = document.getElementById("r");
      if (!h || !w) {
        setResult(result, "<p>Please enter height and weight.</p>");
        return;
      }
      const bmi = w / (h * h);
      let cat = "Obese";
      let col = "#dc2626";
      if (bmi < 18.5) {
        cat = "Underweight";
        col = "#b45309";
      } else if (bmi < 25) {
        cat = "Normal ✅";
        col = "#0f9d6c";
      } else if (bmi < 30) {
        cat = "Overweight";
        col = "#b45309";
      }

      setResult(
        result,
        '<div class="big" style="color:' +
          col +
          '">BMI: ' +
          bmi.toFixed(1) +
          " — " +
          cat +
          "</div><ul><li><span>Underweight</span><b>&lt; 18.5</b></li><li><span>Normal</span><b>18.5 – 24.9</b></li><li><span>Overweight</span><b>25 – 29.9</b></li><li><span>Obese</span><b>≥ 30</b></li></ul>",
      );
    });
  }

  if (isPage("discount-calculator")) {
    attachCalcForm("discount-calculator", () => {
      const p = +document.getElementById("price").value;
      const d = +document.getElementById("d").value;
      const result = document.getElementById("r");
      if (isNaN(p) || isNaN(d)) {
        setResult(result, "<p>Please enter price and discount.</p>");
        return;
      }
      const save = (p * d) / 100;
      const final = p - save;
      setResult(
        result,
        '<div class="big">Final Price: ₹' +
          final.toLocaleString("en-IN") +
          '</div><ul><li><span>You save</span><b style="color:#0f9d6c">₹' +
          save.toLocaleString("en-IN") +
          " (" +
          d +
          "%)</b></li><li><span>Original price</span><b>₹" +
          p.toLocaleString("en-IN") +
          "</b></li></ul>",
      );
    });
  }

  if (isPage("emi-calculator")) {
    attachCalcForm("emi-calculator", () => {
      const P = +document.getElementById("p").value;
      const rate = +document.getElementById("r").value;
      const yrs = +document.getElementById("n").value;
      const result = document.getElementById("r");
      if (!P || !yrs) {
        setResult(result, "<p>Please fill all fields.</p>");
        return;
      }
      const i = rate / 1200;
      const n = yrs * 12;
      const emi = i
        ? (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
        : P / n;
      const total = emi * n;
      setResult(
        result,
        '<div class="big">Monthly EMI: ₹' +
          Math.round(emi).toLocaleString("en-IN") +
          "</div><ul><li><span>Principal amount</span><b>₹" +
          P.toLocaleString("en-IN") +
          "</b></li><li><span>Total interest</span><b>₹" +
          Math.round(total - P).toLocaleString("en-IN") +
          "</b></li><li><span>Total payment</span><b>₹" +
          Math.round(total).toLocaleString("en-IN") +
          "</b></li></ul>",
      );
    });
  }

  if (isPage("gst-calculator")) {
    attachCalcForm("gst-calculator", () => {
      const a = +document.getElementById("amt").value;
      const rt = +document.getElementById("rate").value;
      const mode = document.getElementById("mode").value;
      const result = document.getElementById("r");
      let base = 0;
      let gst = 0;
      let total = 0;

      if (mode === "add") {
        base = a;
        gst = (a * rt) / 100;
        total = a + gst;
      } else {
        total = a;
        base = a / (1 + rt / 100);
        gst = a - base;
      }

      setResult(
        result,
        '<div class="big">GST Amount: ₹' +
          gst.toFixed(2) +
          "</div><ul><li><span>Base amount</span><b>₹" +
          base.toFixed(2) +
          "</b></li><li><span>CGST @" +
          rt / 2 +
          "%</span><b>₹" +
          (gst / 2).toFixed(2) +
          "</b></li><li><span>SGST @" +
          rt / 2 +
          "%</span><b>₹" +
          (gst / 2).toFixed(2) +
          "</b></li><li><span>Total (incl. GST)</span><b>₹" +
          total.toFixed(2) +
          "</b></li></ul>",
      );
    });
  }

  if (isPage("password-generator")) {
    const len = document.getElementById("len");
    const result = document.getElementById("r");
    const charsMap = {
      u: "ABCDEFGHJKLMNPQRSTUVWXYZ",
      l: "abcdefghijkmnopqrstuvwxyz",
      n: "23456789",
      s: "!@#$%^&*()-_=+[]{}<>?",
    };

    const generatePassword = () => {
      let chars = "";
      for (const key in charsMap) {
        if (document.getElementById(key).checked) chars += charsMap[key];
      }
      if (!chars) {
        setResult(result, "<p>Select at least one character type.</p>");
        return;
      }

      const arr = new Uint32Array(+len.value);
      crypto.getRandomValues(arr);
      let pw = "";
      for (const x of arr) pw += chars[x % chars.length];

      setResult(
        result,
        '<div class="big" style="word-break:break-all;font-size:1.2rem">' +
          pw +
          '</div><ul><li><button class="btn" style="padding:8px" type="button" onclick="navigator.clipboard.writeText(\'' +
          pw.replace(/'/g, "\\'") +
          "')\">📋 Copy to clipboard</button></li></ul>",
      );
    };

    attachCalcForm("password-generator", generatePassword);
    const lv = document.getElementById("lv");
    if (len && lv) {
      len.addEventListener("input", () => {
        lv.textContent = len.value;
        generatePassword();
      });
    }
    document
      .querySelectorAll("#u,#l,#n,#s")
      .forEach((c) => c.addEventListener("change", generatePassword));
    generatePassword();
  }

  if (isPage("percentage-calculator")) {
    attachCalcForm("percentage-calculator", () => {
      const a = +document.getElementById("a").value;
      const b = +document.getElementById("b").value;
      const mode = document.getElementById("mode").value;
      const result = document.getElementById("r");
      if (isNaN(a) || isNaN(b)) {
        setResult(result, "<p>Please enter both values.</p>");
        return;
      }

      let out = "";
      if (mode === "of")
        out =
          a + "% of " + b + ' = <div class="big">' + (a * b) / 100 + "</div>";
      else if (mode === "what")
        out =
          a +
          ' is <div class="big">' +
          (b ? ((a / b) * 100).toFixed(2) : "∞") +
          "%</div> of " +
          b;
      else
        out =
          "% change from " +
          a +
          " to " +
          b +
          ' = <div class="big">' +
          (a ? (((b - a) / Math.abs(a)) * 100).toFixed(2) : "∞") +
          "%</div>";

      setResult(result, out);
    });
  }

  if (isPage("sip-calculator")) {
    attachCalcForm("sip-calculator", () => {
      const P = +document.getElementById("p").value;
      const rate = +document.getElementById("r").value;
      const yrs = +document.getElementById("n").value;
      const result = document.getElementById("r");
      if (!P || !yrs) {
        setResult(result, "<p>Please fill all fields.</p>");
        return;
      }
      const i = rate / 1200;
      const n = yrs * 12;
      const fv = i ? P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : P * n;
      const inv = P * n;
      setResult(
        result,
        '<div class="big">Maturity: ₹' +
          Math.round(fv).toLocaleString("en-IN") +
          "</div><ul><li><span>Total invested</span><b>₹" +
          inv.toLocaleString("en-IN") +
          "</b></li><li><span>Wealth gained</span><b>₹" +
          Math.round(fv - inv).toLocaleString("en-IN") +
          "</b></li><li><span>Growth multiple</span><b>" +
          (fv / inv).toFixed(2) +
          "×</b></li></ul>",
      );
    });
  }

  if (isPage("unit-converter")) {
    const U = {
      length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        inch: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344,
      },
      weight: {
        kg: 1,
        g: 0.001,
        mg: 1e-6,
        lb: 0.45359237,
        oz: 0.0283495,
        tonne: 1000,
      },
      temp: { c: 1, f: 1, k: 1 },
    };
    const LN = {
      m: "Meter",
      km: "Kilometer",
      cm: "Centimeter",
      mm: "Millimeter",
      inch: "Inch",
      ft: "Foot",
      yd: "Yard",
      mi: "Mile",
      kg: "Kilogram",
      g: "Gram",
      mg: "Milligram",
      lb: "Pound",
      oz: "Ounce",
      tonne: "Tonne",
      c: "Celsius",
      f: "Fahrenheit",
      k: "Kelvin",
    };
    const cat = document.getElementById("cat");
    const from = document.getElementById("from");
    const to = document.getElementById("to");
    const result = document.getElementById("r");

    const calcUnit = () => {
      const v = +document.getElementById("val").value;
      const c = cat.value;
      if (isNaN(v)) {
        setResult(result, "<p>Enter a value.</p>");
        return;
      }

      let out = 0;
      if (c === "temp") {
        const celsius =
          from.value === "c"
            ? v
            : from.value === "f"
              ? ((v - 32) * 5) / 9
              : v - 273.15;
        out =
          to.value === "c"
            ? celsius
            : to.value === "f"
              ? (celsius * 9) / 5 + 32
              : celsius + 273.15;
      } else {
        out = (v * U[c][from.value]) / U[c][to.value];
      }

      setResult(
        result,
        '<div class="big">' +
          v +
          " " +
          LN[from.value] +
          " = " +
          parseFloat(out.toPrecision(8)) +
          " " +
          LN[to.value] +
          "</div>" +
          (c !== "temp"
            ? "<ul><li><span>1 " +
              LN[from.value] +
              "</span><b>" +
              parseFloat((U[c][from.value] / U[c][to.value]).toPrecision(8)) +
              " " +
              LN[to.value] +
              "</b></li></ul>"
            : ""),
      );
    };

    const fillUnits = () => {
      const c = cat.value;
      const units = c === "temp" ? ["c", "f", "k"] : Object.keys(U[c]);
      from.innerHTML = units
        .map((u) => '<option value="' + u + '">' + LN[u] + "</option>")
        .join("");
      to.innerHTML = units
        .map((u) => '<option value="' + u + '">' + LN[u] + "</option>")
        .join("");
      to.selectedIndex = 1;
      calcUnit();
    };

    if (cat && from && to) {
      cat.addEventListener("change", fillUnits);
      from.addEventListener("change", calcUnit);
      to.addEventListener("change", calcUnit);
      document.getElementById("val").addEventListener("input", calcUnit);
      fillUnits();
      attachCalcForm("unit-converter", calcUnit);
    }
  }

  if (isPage("word-counter")) {
    const textarea = document.getElementById("t");
    const result = document.getElementById("r");
    const calcWord = () => {
      const txt = textarea.value;
      const words = (txt.trim().match(/\S+/g) || []).length;
      const chars = txt.length;
      const nospace = txt.replace(/\s/g, "").length;
      const sents = (
        txt.trim().match(/[^.!?]+[.!?]+/g) || (txt.trim() ? [txt.trim()] : [])
      ).length;
      const mins = words / 200;
      setResult(
        result,
        '<ul style="margin:0"><li><span>Words</span><b class="big">' +
          words +
          "</b></li><li><span>Characters</span><b>" +
          chars +
          "</b></li><li><span>Characters (no spaces)</span><b>" +
          nospace +
          "</b></li><li><span>Sentences</span><b>" +
          sents +
          "</b></li><li><span>Reading time</span><b>" +
          (mins < 1
            ? Math.max(1, Math.round(mins * 60)) + " sec"
            : mins.toFixed(1) + " min") +
          "</b></li></ul>",
      );
    };

    if (textarea) {
      textarea.addEventListener("input", calcWord);
      calcWord();
    }
  }
});
