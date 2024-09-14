import {cloneDeep, isEqual} from 'lodash';

export function compareEditCreateDelete(
  legacyVector: any[],
  newVector: any[],
  comparator: (legacyItem: any, newItem: any) => boolean,
  fieldsToCompare: string[]
) {
  const clonedLegacyVector = cloneDeep(legacyVector);
  const clonedNewVector = cloneDeep(newVector);
  let added: any[] = [];
  let edited: any[] = [];
  let deleted: number[] = [];
  let found = false;
  let isItemEdited = false;
  let isFieldEdited = false;

  clonedNewVector.forEach((newItem) => {
    found = false;
    clonedLegacyVector.forEach((legacyItem) => {
      if (comparator(legacyItem, newItem)) {
        found = true;
        let clonedLegacyItem = cloneDeep(legacyItem);
        isItemEdited = false;
        fieldsToCompare.forEach((field: string) => {
          isFieldEdited = false;
          if (typeof legacyItem[field] === 'object') {
            if (!isEqual(legacyItem[field], newItem[field])) {
              isFieldEdited = true;
            }
          } else {
            if (legacyItem[field] !== newItem[field]) {
              isFieldEdited = true;
            }
          }
          if (isFieldEdited) {
            clonedLegacyItem[field] = newItem[field];
            isItemEdited = true;
          }
        });
        if (isItemEdited) edited.push(clonedLegacyItem);
      }
    });
    if (!found) {
      added.push(newItem);
    }
  });

  clonedLegacyVector.forEach((legacyItem) => {
    found = false;
    clonedNewVector.forEach((newItem) => {
      if (comparator(legacyItem, newItem)) {
        found = true;
      }
    });

    if (!found) {
      deleted.push(legacyItem.id);
    }
  });

  return {
    added,
    edited,
    deleted,
  };
}
