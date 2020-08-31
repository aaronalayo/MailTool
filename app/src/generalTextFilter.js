const generalTextFilter = /^[a-zA-Z \-\_\/!0-9æøåÆØÅ\.,!?():+\[\]\n\t\r]*$/;
exports.generalTextFilter = generalTextFilter;
const mailDataFilter = /^[a-zA-Z \-\_\/!0-9æøåÆØÅ\.,!?&#():;+\[\]\n\t\r]*$/;
exports.mailDataFilter = mailDataFilter;
const eMailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
exports.eMailFilter = eMailFilter;
