/*
    MIT License

    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
import { Scopio, sequelize } from "../models/Scopio.js";
await sequelize.sync();

/*
  Content negotiation helper.
  - Postman / API clients that send "Accept: application/json" (or a JSON body)
    get a JSON response.
  - The browser forms from views/scopio.xian and views/edit.xian get a normal
    HTML page / redirect, because browsers send "Accept: text/html,...".
*/
const wantsJson = (req) =>
  req.is("application/json") ||
  (req.get("Accept") || "").includes("application/json");

const scopio = {
  // ---------- ACT 1: INSERT (POST /scopio) ----------
  insert: async (req, res) => {
    try {
      const record = await Scopio.create(req.body);

      if (wantsJson(req)) {
        return res.status(201).json(record);
      }
      // ACT 3: the insert form posts here, then goes back to the list page.
      res.redirect("/scopio");
    } catch (err) {
      if (wantsJson(req)) {
        return res.status(400).json({ error: err.message });
      }
      res.redirect("/scopio");
    }
  },

  // ---------- ACT 2: FIND ALL (GET /scopio) ----------
  // ---------- ACT 3: renders views/scopio.xian with { data } ----------
  view: async (req, res) => {
    const records = await Scopio.findAll();

    if (wantsJson(req)) {
      return res.json(records);
    }

    const data = records.map((record) => record.get({ plain: true }));
    res.render("scopio", { title: "Scopio Records", data });
  },

  // ---------- ACT 3: EDIT FORM (GET /scopio/:id/edit) ----------
  editView: async (req, res) => {
    const record = await Scopio.findByPk(req.params.id);

    if (!record) {
      return res.status(404).send("Scopio record not found");
    }

    res.render("edit", {
      title: "Edit Scopio",
      data: record.get({ plain: true }),
    });
  },

  // ---------- ACT 2: FIND ONE (GET /scopio/:id) returns JSON ----------
  show: async (req, res) => {
    const record = await Scopio.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ error: "Scopio record not found" });
    }

    res.json(record);
  },

  // ---------- ACT 2: UPDATE (POST /scopio/:id/update) ----------
  update: async (req, res) => {
    const [affected] = await Scopio.update(req.body, {
      where: { id: req.params.id },
    });

    if (wantsJson(req)) {
      return res.json({ updated: affected });
    }
    res.redirect("/scopio");
  },

  // ---------- ACT 2: DELETE (GET /scopio/:id/delete) ----------
  destroy: async (req, res) => {
    const deleted = await Scopio.destroy({
      where: { id: req.params.id },
    });

    if (wantsJson(req)) {
      return res.json({ deleted });
    }
    res.redirect("/scopio");
  },
};

export { scopio };
