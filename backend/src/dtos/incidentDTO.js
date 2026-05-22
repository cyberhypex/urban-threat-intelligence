const crypto = require("crypto");

class IncidentDTO {
    constructor(rawIncident, category, severity, location) {
        this.title = rawIncident.title?.trim() || "Unknown Incident";

        this.description = rawIncident.socialimage || "";

        this.category = category;

        this.severity = severity;

        this.location = location;

       // this.state = "Assam";

       // this.country = "India";

        this.sourceUrl = rawIncident.url?.trim() || "";

        this.sourceDomain = rawIncident.domain?.trim() || "";

        this.publishedAt = this.parseGdeltDate(rawIncident.seendate);

        this.hash = this.generateHash();
    }

    parseGdeltDate(seendate) {
        if (!seendate || seendate.length !== 14) {
            return new Date();
        }

        const year = seendate.substring(0, 4);
        const month = seendate.substring(4, 6);
        const day = seendate.substring(6, 8);
        const hour = seendate.substring(8, 10);
        const minute = seendate.substring(10, 12);
        const second = seendate.substring(12, 14);

        return new Date(
            `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
        );
    }

    generateHash() {
        const rawString = `${this.title.toLowerCase().trim()}-${this.location.toLowerCase().trim()}-${this.publishedAt.toISOString()}`;

        return crypto
            .createHash("sha256")
            .update(rawString)
            .digest("hex");
    }
}

module.exports = IncidentDTO;