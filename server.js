// backend/server.js
const express = require("express");
const fs = require("fs");
const { execSync } = require("child_process");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const COMPILER_DIR = path.join(__dirname, "prototype-0");
const linuxCompiler = path.join(COMPILER_DIR, "compiler");
const windowsCompiler = path.join(COMPILER_DIR, "compiler.exe");

// prefer linux binary if exists
const COMPILER = fs.existsSync(linuxCompiler) ? linuxCompiler : windowsCompiler;

const INPUT = path.join(COMPILER_DIR, "input.p0");
const ASM_FILE = path.join(COMPILER_DIR, "MIPS64.s");
const BIN_FILE = path.join(COMPILER_DIR, "MACHINE_CODE.mc");

// -------------------------------------------
// SAFE /compile — DOES NOT OUTPUT ASM/HEX ON ERROR
// -------------------------------------------
app.post("/compile", (req, res) => {
  const code = req.body.code;
  const tab = req.body.tab || "Output";

  try {
    fs.writeFileSync(INPUT, code);

    let result = "";

    // ------------ Helper: Extract REAL compiler error message (deduplicated) --------------
    const extractCompilerError = (err) => {
      let parts = [];

      if (err.stdout) parts.push(err.stdout.toString());
      if (err.stderr) parts.push(err.stderr.toString());

      if (err.output) {
        parts.push(
          err.output
            .map((b) => (b ? b.toString() : ""))
            .join("")
        );
      }

      // combine all, split by lines, remove empty and duplicates
      let lines = parts
        .join("\n")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // deduplicate lines
      lines = [...new Set(lines)];

      if (!lines.length) lines.push(err.message || "Unknown compilation error");

      return lines.join("\n");
    };

    // ------------ Helper: Write error into assembly + binary ------------
    const writeErrorFiles = (errorText) => {
      fs.writeFileSync(ASM_FILE, errorText);
      fs.writeFileSync(BIN_FILE, errorText);
    };

    // ------------------- OUTPUT mode -------------------
    if (tab === "Output") {
      try {
        result = execSync(`cd "${COMPILER_DIR}" && .\\compiler.exe "${INPUT}"`, {
          encoding: "utf8",
          cwd: COMPILER_DIR
        }).trim();
      } catch (err) {
        const realError = extractCompilerError(err);
        writeErrorFiles(realError);
        return res.json({ result: realError });
      }
    }

    // ------------------- ASSEMBLY mode -------------------
    else if (tab === "Assembly") {
      try {
        execSync(`cd "${COMPILER_DIR}" && .\\compiler.exe -S "${INPUT}"`, {
          stdio: "ignore",
          cwd: COMPILER_DIR
        });
      } catch (err) {
        const realError = extractCompilerError(err);
        writeErrorFiles(realError);
        return res.json({ result: realError });
      }

      result = fs.existsSync(ASM_FILE)
        ? fs.readFileSync(ASM_FILE, "utf8").trim()
        : "Assembly not generated";
    }

    // ------------------- BINARY mode -------------------
    else if (tab === "Binary/Hex") {
      try {
        execSync(`cd "${COMPILER_DIR}" && .\\compiler.exe -S "${INPUT}"`, {
          stdio: "ignore",
          cwd: COMPILER_DIR
        });
      } catch (err) {
        const realError = extractCompilerError(err);
        writeErrorFiles(realError);
        return res.json({ result: realError });
      }

      result = fs.existsSync(BIN_FILE)
        ? fs.readFileSync(BIN_FILE, "utf8").trim()
        : "Binary not generated";
    }

    res.json({ result: result || "No output" });

  } catch (err) {
    return res.json({ result: `Error: ${err.message || "Unknown error"}` });
  }
});

// -------------------------------------------
// Additional routes (unchanged)
// -------------------------------------------
app.get("/generated/assembly", (req, res) => {
  try {
    if (fs.existsSync(ASM_FILE)) {
      const asm = fs.readFileSync(ASM_FILE, "utf8");
      res.json({ assembly: asm });
    } else {
      res.json({ assembly: null, message: "Assembly not found" });
    }
  } catch (e) {
    res.status(500).json({ assembly: null, error: e.message });
  }
});

app.get("/generated/hex", (req, res) => {
  try {
    if (fs.existsSync(BIN_FILE)) {
      const hexText = fs.readFileSync(BIN_FILE, "utf8").trim();
      res.json({ hex: hexText });
    } else {
      res.json({ hex: null, message: "Binary not found" });
    }
  } catch (e) {
    res.status(500).json({ hex: null, error: e.message });
  }
});

app.get("/generated", (req, res) => {
  try {
    const assembly = fs.existsSync(ASM_FILE) ? fs.readFileSync(ASM_FILE, "utf8") : null;
    const hex = fs.existsSync(BIN_FILE) ? fs.readFileSync(BIN_FILE, "utf8").trim() : null;
    res.json({ assembly, hex });
  } catch (e) {
    res.status(500).json({ assembly: null, hex: null, error: e.message });
  }
});

app.get("/load-source", (req, res) => {
  try {
    if (fs.existsSync(INPUT)) {
      const code = fs.readFileSync(INPUT, "utf8");
      res.json({ code });
    } else {
      res.json({ code: "// source_code.p0 not found" });
    }
  } catch (e) {
    res.status(500).json({ code: "", error: e.message });
  }
});

app.listen(3001, () => {
  console.log("CSC112 COMPILER BACKEND — ERROR SAFE MODE ENABLED");
});
