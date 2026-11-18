import database from "../config/firebase.js";

export const addCompany = async (request, response, next) => {
  try {
    await database.ref("companies").push(request.body);
    response.json({ success: true, message: "Company Added" });
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (_request, response, next) => {
  try {
    const snapshot = await database.ref("companies").get();
    const companies = snapshot.val();
    response.json(
      companies
        ? Object.entries(companies).map(([id, company]) => ({ ...company, id }))
        : [],
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (request, response, next) => {
  try {
    await database.ref(`companies/${request.params.companyId}`).remove();
    response.json({ success: true, message: "Company Deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (request, response, next) => {
  try {
    await database.ref(`companies/${request.params.companyId}`).update(request.body);
    response.json({ success: true, message: "Company Updated" });
  } catch (error) {
    next(error);
  }
};
