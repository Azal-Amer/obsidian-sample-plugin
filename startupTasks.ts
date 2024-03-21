import Rand from "rand-seed";

export function randomTimeRange(range: string, frequency: number) {
	// First we need to parse the string, so we split it into it's constituent parts
	let [start, end] = range.split("-");
	// then we need to break the start and end into their hours and minutes
	let [startHour, startMinute] = start.split(":");
	let [endHour, endMinute] = end.split(":");
	// get the current time in hours and minutes

	let now = new Date();
	//
	// if the current time is before the start time, we need to set the current time to the start time
	// check if we're before the endtime, makes no sense to update the time if we're after the end time

	// if (
	// 	currentHour < parseInt(endHour) ||
	// 	(currentHour == parseInt(endHour) &&
	// 		currentMinute < parseInt(endMinute))
	// ) {
	// 	if (currentHour > parseInt(startHour)) {
	// 		startHour = currentHour.toString();

	// 		startMinute = currentMinute.toString();
	// 		updatedStart = true;
	// 	} else if (
	// 		currentHour == parseInt(startHour) &&
	// 		currentMinute > parseInt(startMinute)
	// 	) {
			// startMinute = currentMinute.toString();
	// 		updatedStart = true;
	// 	}
	// }
    

	// Now that we have our start time, we need to get a random time between the start and end time
	// do do this, since we have our times as strings,make them integers
	let startTime = [parseInt(startHour), parseInt(startMinute)];
	let endTime = [parseInt(endHour), parseInt(endMinute)];
	// get a random number
	let randomTimes = [];
	let seed =
		now.getDay().toString() +
		now.getMonth().toString() +
		now.getFullYear().toString();
	const rand = new Rand(seed);
	// need pseudorandom numbers to avoid conflicts when syncing on multiple devices

	for (let i = 1; i <= frequency; i++) {
		let time = { hour: 0, minute: 0 };
        let randomFloat = rand.next();
		let randomHour = Math.floor(
			randomFloat * (endTime[0] - startTime[0]) + startTime[0])
		let randomMinute = Math.floor(rand.next() * 60);
		time.hour = randomHour;
		time.minute = randomMinute;
		randomTimes.push(time);
	}

	return randomTimes;
}
