import {
  getData,
  postData,
  updateData,
  deleteData,
} from "./apiAxios";


/**
 * Get module list
 * Example:
 * getRecords("categories")
 * GET /categories
 */
export const getRecords = async (module) => {
  return await getData(module);
};


/**
 * Get single record
 * Example:
 * getRecord("categories", 5)
 * GET /categories/5
 */
export const getRecord = async (module, id) => {
  return await getData(`${module}/${id}`);
};


/**
 * Add OR Edit record
 *
 * If data.id exists  -> PUT
 * If data.id missing -> POST
 *
 * Example:
 * saveRecord("categories", data)
 */
export const saveRecord = async (module, data) => {

  // EDIT
  if (data?.id) {
    return await updateData(
      `${module}/${data.id}`,
      data
    );
  }

  // ADD
  return await postData(
    module,
    data
  );
};


/**
 * Delete record
 * Example:
 * deleteRecord("categories", 5)
 * DELETE /categories/5
 */
export const deleteRecord = async (module, id) => {
  return await deleteData(
    `${module}/${id}`
  );
};