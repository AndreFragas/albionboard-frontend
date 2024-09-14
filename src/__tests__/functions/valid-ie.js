import {validateIE} from 'validations-br';

test('test validateIEInvert function', () => {
  function validateIEInvert(uf, ie) {
    return validateIE(ie, uf);
  }

  expect(validateIEInvert('AC', '0119287404266')).toBe(true);
  expect(validateIEInvert('AL', '248681214')).toBe(true);
  expect(validateIEInvert('AP', '030098284')).toBe(true);
  expect(validateIEInvert('AM', '264664337')).toBe(true);
  expect(validateIEInvert('BA', '019727545')).toBe(true);
  expect(validateIEInvert('CE', '985173572')).toBe(true);
  expect(validateIEInvert('DF', '0747134100124')).toBe(true);
  expect(validateIEInvert('ES', '867571381')).toBe(true);
  expect(validateIEInvert('GO', '109729668')).toBe(true);
  expect(validateIEInvert('MA', '126518750')).toBe(true);
  expect(validateIEInvert('MT', '66658838019')).toBe(true);
  expect(validateIEInvert('MS', '289198917')).toBe(true);
  expect(validateIEInvert('MG', '4974749088946')).toBe(true);
  expect(validateIEInvert('PA', '157116867')).toBe(true);
  expect(validateIEInvert('PB', '589804367')).toBe(true);
  expect(validateIEInvert('PR', '5550343772')).toBe(true);
  expect(validateIEInvert('PE', '1086868-25')).toBe(true);
  expect(validateIEInvert('PI', '786863994')).toBe(true);
  expect(validateIEInvert('RJ', '14532641')).toBe(true);
  expect(validateIEInvert('RN', '204460751')).toBe(true);
  expect(validateIEInvert('RS', '1555813221')).toBe(true);
  expect(validateIEInvert('RO', '60982883479442')).toBe(true);
  expect(validateIEInvert('RR', '243910336')).toBe(true);
  expect(validateIEInvert('SP', '863386153152')).toBe(true);
  expect(validateIEInvert('SC', '576614254')).toBe(true);
  expect(validateIEInvert('SC', '530890356')).toBe(true);
  expect(validateIEInvert('SE', '759775494')).toBe(true);
  expect(validateIEInvert('TO', '32036309977')).toBe(true);
  expect(validateIEInvert('TO', '326309977')).toBe(true);
});
