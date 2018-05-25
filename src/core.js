const {List, Map} = require("immutable");

exports.setEntries = (state, entries) => {
    return state.set("entries", List(entries));
};

exports.next = (state) => {
    const entries = state.get("entries").concat(getWinners(state.get("vote")));

    if (entries.size === 1) {
        return state.remove("vote")
            .remove("entries")
            .set("winner", entries.first());
    }

    return state.merge({
        vote: Map({
            pair: entries.take(2)
        }),
        entries: entries.skip(2)
    })
};

const getWinners = (vote) => {
    if (!vote) return [];
    const [a, b] = vote.get("pair");
    const votesA = vote.getIn(["tally", a], 0);
    const votesB = vote.getIn(["tally", b], 0);

    if (votesA === votesB) return [a, b];

    return votesA > votesB ? [a] : [b];
};

exports.vote = (state, entry) => {
    return state.updateIn(
        ["vote", "tally", entry],
        0,
        tally => tally + 1
    );
};
