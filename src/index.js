import { normalize } from 'normalizr';
/**
 * Sets isLoading => true
 * @param {*} state
 */
export const setIsLoading = state => ({ ...state, isLoading: true });

/**
 * Sets isLoading => false
 * @param {*} state
 */
export const setIsNotLoading = state => ({ ...state, isLoading: false });

/**
 * Get the entities for a given state.
 * @param {*} state
 */
export const getEntities = state => state.entities;

/**
 * Add an entity to the state
 * @param {*} param0
 * @param {*} currentEntities
 */
export const addEntity = ({ id, ...newEntity }, currentEntities) => {
  return { ...currentEntities, [id]: { id, ...newEntity } };
};

/**
 * Adds new entities by performing a merge between existing entities and new entities.
 * New Entity will override the data of an existing entity.
 * @param {object} newEntities
 * @param {object} currentEntities
 * @returns {{}}
 */
export const addEntities = (newEntities, currentEntities = {}) => {
  let normalizedEntities;

  if (Array.isArray(newEntities)) {
    normalizedEntities = normalize(newEntities);
  } else {
    normalizedEntities = newEntities;
  }

  const newEntityKeys = Object.keys(normalizedEntities);

  if (newEntityKeys.length > 0) {
    newEntityKeys.forEach(entityId => {
      if (currentEntities.hasOwnProperty(entityId)) {
        normalizedEntities[entityId] = { ...currentEntities[entityId], ...normalizedEntities[entityId] };
      }
    });
  }
  return { ...currentEntities, ...normalizedEntities };
};

/**
 * Updates an existing entity by performing an merge between the current record and the updated fields.
 * @param {number, string} id
 * @param {object} updatedFields
 * @param {object} currentEntities
 */
export const updateEntity = (id, updatedFields, currentEntities) => {
  try {
    const entityToUpdate = currentEntities[id];

    return {
      ...currentEntities,
      [id]: { ...entityToUpdate, ...updatedFields }
    };
  } catch (e) {
    // TODO - add dev logger
    return currentEntities;
  }
};

/**
 * Delete an Entity from the state
 * @param {number, string} id
 * @param {object} currentEntities
 */
export const deleteEntity = (id, currentEntities) => {
  const entities = { ...currentEntities };

  delete entities[id];
  return entities;
};

/**
 * Delete Entities from the state
 * @param {number, string} ids
 * @param {object} currentEntities
 */
export const deleteEntities = (ids = [], currentEntities) => {
  const entities = { ...currentEntities };

  ids.forEach(id => {
    delete entities[id];
  });
  return entities;
};

/**
 * Add a union id
 * @param {number, string} id
 * @param {array} unionIds
 */
export const addUnionId = (id, unionIds) => {
  return [...unionIds, id];
};

/**
 * Add union ids
 * @param {number, string} ids
 * @param {array} unionIds
 */
export const addUnionIds = (ids, unionIds) => {
  return [...unionIds, ...ids];
};

/**
 * Delete a union by id
 * @param {number, string} id
 * @param {arrary} unionIds
 */
export const deleteUnionId = (id, unionIds) => {
  return unionIds.filter(unionId => id !== unionId);
};
