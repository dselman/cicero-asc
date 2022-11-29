import assert from "assert";
import { acceptanceofdelivery } from "../build/debug.js";
const contract = {
    shipper: 'Acme',
    receiver: 'Clause',
    deliverable: 'Widgets',
    businessDays: 10,
    attachment: 'Appendix 2'
};

const request = {
    deliverableReceivedAt: new Date('2022-11-29').toISOString(),
    inspectionPassed: true
}

const responseString = acceptanceofdelivery(JSON.stringify(contract), JSON.stringify(request));
const response = JSON.parse(responseString);
// console.log(JSON.stringify(response, null, 2));

assert.equal(response.status, 2);
console.log('All good.');
