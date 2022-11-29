// The entry file of your WebAssembly module.

import { JSON } from "json-as/assembly";

@json
class InspectDeliverable {
  deliverableReceivedAt: string;
  inspectionPassed: boolean;
}

@json
enum InspectionStatus {
  PASSED_TESTING,
  FAILED_TESTING,
  OUTSIDE_INSPECTION_PERIOD,
}

@json
class InspectionResponse {
  status: InspectionStatus;
  shipper: string;
  receiver: string;
}

@json
class AcceptanceOfDeliveryClause {
  shipper: string;
  receiver: string;
  deliverable: string;
  businessDays: i32;
  attachment: string;
}

@json
enum TemporalUnit {
  seconds,
  minutes,
  hours,
  days,
  weeks
}

@json
class Duration {
  amount: i32;
  unit: TemporalUnit;
}

function isBefore(a: Date, b: Date): boolean {
	return a.getTime() < b.getTime();
}

function isAfter(a: Date, b: Date): boolean {
	return a.getTime() > b.getTime();
}

function addDuration(a: Date, duration: Duration): Date {
	// TODO
	return new Date(a.getTime() + duration.amount);
}

// const stringified = JSON.stringify<Player>(data);

export function acceptanceofdelivery(contractJson: string, requestJson:string): string {
  const contract = JSON.parse<AcceptanceOfDeliveryClause>(contractJson);
  const request = JSON.parse<InspectDeliverable>(requestJson);

  const now = new Date(Date.now());

  const received = Date.parse(request.deliverableReceivedAt);
		if (!isBefore(received, now)) {
			throw new Error("Transaction time is before the deliverable date.");
		}

		const status = isAfter(now, addDuration(received, { amount: contract.businessDays, unit: TemporalUnit.days }))
			? InspectionStatus.OUTSIDE_INSPECTION_PERIOD : request.inspectionPassed ? InspectionStatus.PASSED_TESTING : InspectionStatus.FAILED_TESTING;

    const response:InspectionResponse = {
			status: status,
			shipper: contract.shipper,   // This should be a relationship
			receiver: contract.receiver  // This should be a relationship
    }

    return JSON.stringify<InspectionResponse>(response);
}
