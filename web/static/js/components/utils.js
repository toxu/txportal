
function makePhase(value, word) {
    if (value > 1) {
        return value + word + "s";
    } else {
        return value + word;
    }
}

export function timeSince(to) {
    var seconds = Math.floor((new Date() - to) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return makePhase(interval, " year");
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return makePhase(interval, " month");
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return makePhase(interval, " day");
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return makePhase(interval, " hr");
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " min";
    }
    return Math.floor(seconds) + " sec";
}

export function strFromDuration(duration) {
    var seconds = Math.floor(duration / 1000);
    var interval = Math.floor(seconds / 31536000);
    var ret = "";
    if (interval >= 1) {
        ret += makePhase(interval, " year") + " ";
        seconds -= interval * 31536000;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        ret += makePhase(interval, " month") + " ";
        seconds -= interval * 2592000;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        ret += makePhase(interval, " day") + " ";
        seconds -= interval * 86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        ret += makePhase(interval, " hr") + " ";
        seconds -= interval * 3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        ret += interval + " min ";
        seconds -= interval * 60;
    }
    ret += Math.floor(seconds) + " sec ";
    return ret;
}

export function dateToString(date) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString('en-US');
}