var songBuilder = (function(seedrandom) {
    var context;
    var currentSong;
    var currentInstruments = [];
    var measuresPerSegment = 16;
    function build()  {
        var formSeedInputs = ['aatrox', 'ahri', 'akali', 'alistar', 'amumu', 'anivia', 'annie', 'ashe', 'aurelionsol', 'azir', 'bard', 'blitzcrank', 'brand', 'braum', 'caitlyn', 'cassiopeia', 'chogath', 'corki', 'darius', 'diana', 'drmundo', 'draven', 'ekko', 'elise', 'evelynn', 'ezreal', 'fiddlesticks', 'fiora', 'fizz', 'galio', 'gangplank', 'garen', 'gnar', 'gragas', 'graves', 'hecarim', 'heimerdinger', 'illaoi', 'irelia', 'janna', 'jarvaniv'];
        var prng = seedrandom(getSeed(formSeedInputs), { global: false });
        // Start by building the form of the song (e.g. AABA)
        // A "rule" is a function that determines the probability of getting to each state from the current state.
        // It returns a stateMap, which is an array of probabilities for each state.
        var form = markovChain.build(formRule, 8, prng);
        
        var segments = [];
        for (var i = 0; i < 3; ++i) {
            segments.push({});
        }
        
        var bassSeedInputs = ['jax',
            'jayce',
            'jhin',
            'jinx',
            'kalista',
            'karma',
            'karthus',
            'kassadin',
            'katarina',
            'kayle',
            'kennen',
            'khazix',
            'kindred',
            'kogmaw',
            'leblanc',
            'leesin',
            'leona',
            'lissandra',
            'lucian',
            'lulu',
            'lux',
            'malphite',
            'malzahar',
            'maokai',
            'masteryi',
            'missfortune',
            'mordekaiser',
            'morgana',
            'nami',
            'nasus',
            'nautilus',
            'nidalee',
            'nocturne',
            'nunu'];
        prng = seedrandom(getSeed(bassSeedInputs), { global: false });
        // Generate a chord progression (0=C, 1=Dm, 2=Em, 3=F, etc.)
        for (var i = 0; i < segments.length; ++i) {
            segments[i].chordProgression = markovChain.build(chordRule, 4, prng);
        }
        
        // Generate rhythms for each section
        for (var i = 0; i < segments.length; ++i) {
            segments[i].bassLineRhythm = markovChain.buildRhythm(bassLineRhythmRule, 2, prng);
        }
        
        var melodySeedInputs = ['olaf',
            'orianna',
            'pantheon',
            'poppy',
            'quinn',
            'rammus',
            'reksai',
            'renekton',
            'rengar',
            'riven',
            'rumble',
            'ryze',
            'sejuani',
            'shaco',
            'shen',
            'shyvana',
            'singed',
            'sion',
            'sivir',
            'skarner',
            'sona',
            'soraka',
            'swain',
            'syndra',
            'tahmkench',
            'talon',
            'taric',
            'teemo',
            'thresh',
            'tristana',
            'trundle',
            'tryndamere'];
        prng = seedrandom(getSeed(melodySeedInputs), { global: false });
        
        // Generate rhythms for each section
        for (var i = 0; i < segments.length; ++i) {
            var rhythm = markovChain.buildRhythm(melodyRhythmRule, 4, prng);
            rhythm = rhythm.concat(rhythm).concat(rhythm).concat(rhythm);
            segments[i].melodyRhythm = rhythm;
        }
        
        // Generate a sequence of notes for each segment
        for (var i = 0; i < segments.length; ++i) {
            var segment = segments[i];
            segment.melodyNotes = markovChain.buildNotes(melodyPitchRule, segment.melodyRhythm, segment.chordProgression, prng);
        }
        
        // Generate backgrounds
        var segment = segments[0];
        segment.backgrounds = [];
        if (masteries['ahri']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 1000, initialQ: 100, finalFrequency: 500, finalQ: 1, volume: 0.5, duration: 0.4 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['ahri']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['annie']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 440, initialQ: 0.8, finalFrequency: 440, finalQ: 0.8, volume: 0.2, duration: 1.5 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['annie']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['azir']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 1000, initialQ: 100, finalFrequency: 500, finalQ: 2, volume: 0.5, duration: 2 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['azir']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['caitlyn']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 700, initialQ: 0.2, finalFrequency: 80, finalQ: 200, volume: 0.5, duration: 0.7 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['caitlyn']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['corki']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 200, initialQ: 0.5, finalFrequency: 8, finalQ: 100, volume: 0.6, duration: 0.3, multishots:[0.25, 0.5] },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['corki']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        
        segment = segments[1];
        segment.backgrounds = [];
        if (masteries['janna']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 400, initialQ: 0.8, finalFrequency: 600, finalQ: 0.8, volume: 0.1, duration: 4 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['janna']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['jhin']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 440, initialQ: 0.2, finalFrequency: 8, finalQ: 100, volume: 0.3, duration: 2 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['jhin']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['kalista']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 100, initialQ: 0.7, finalFrequency: 800, finalQ: 100, volume: 2, duration: 1.5 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['kalista']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['karma']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 100, initialQ: 50, finalFrequency: 1000, finalQ: 9, volume: 0.4, duration: 1 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['karma']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['kassadin']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 4000, initialQ: 50, finalFrequency: 100, finalQ: 3, volume: 0.8, duration: 1 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['kassadin']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['quinn']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 100, initialQ: 1, finalFrequency: 50, finalQ: 0.1, volume: 0.5, duration: 2 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['quinn']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        
        segment = segments[2];
        segment.backgrounds = [];
        if (masteries['ryze']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 150, initialQ: 20, finalFrequency: 150, finalQ: 1, volume: 1, duration: 0.9 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['ryze']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['sivir']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 400, initialQ: 0.2, finalFrequency: 100, finalQ: 20, volume: 0.2, duration: 2 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['sivir']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['syndra']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 800, initialQ: 20, finalFrequency: 400, finalQ: 5, volume: 1.2, duration: 2.5 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['syndra']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['teemo']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 500, initialQ: 100, finalFrequency: 1000, finalQ: 1, volume: 1.2, duration: 0.4 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['teemo']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['tristana']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 200, initialQ: 0.2, finalFrequency: 50, finalQ: 1, volume: 0.2, duration: 3 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['tristana']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['vayne']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 1000, initialQ: 0.7, finalFrequency: 500, finalQ: 1, volume: 0.5, duration: 0.4 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['vayne']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['veigar']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 4000, initialQ: 3000, finalFrequency: 4000, finalQ: 50, volume: 1.2, duration: 0.7 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['veigar']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        if (masteries['ziggs']) {
            var background = {
                instrument: WhiteNoiseWithBandPass,
                options: { initialFrequency: 200, initialQ: 50, finalFrequency: 200, finalQ: 50, volume: 1.2, duration: 2 },
                rhythm: markovChain.buildRhythm(backgroundRhythmRules[masteries['ziggs']], 4, prng)
            };
            segment.backgrounds.push(background);
        }
        
        // Make an ending
        // For now just play a double whole note
        var lastForm = form[form.length - 1];
        var lastSegment = segments[lastForm];
        var lastNote = lastSegment.melodyNotes[lastSegment.melodyNotes.length - 1];
        var octaveShift = 0;
        while (lastNote > 7) {
            lastNote -= 7;
            ++octaveShift;
        }
        var endingNote;
        switch (lastNote) {
            case 0:
            case 1:
            case 2:
                endingNote = 0;
                break;
            case 3:
            case 4:
                endingNote = 4;
                break;
            default:
                endingNote = 7;
                break;
        }
        
        var ending = {
            chordProgression: [0],
            bassLineRhythm: [{ duration: 8 }],
            melodyRhythm: [{ duration: 8 }],
            melodyNotes: [endingNote],
        }
        
        currentSong = {
            form: form,
            segments: segments,
            ending: ending,
        };
        return currentSong;
    }
    
    function getSeed(inputs) {
        var s = '';
        for (var i = 0; i < inputs.length; ++i)
            s += masteries[inputs[i]] || 0;
        return s;
    }
    
    function getInstrument(instrumentClass) {
        return new instrumentClass(context);
    }
    
    function play(song)  {
        song = song || currentSong;
        currentInstruments = [];
        // C4-B5
        var frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77];
        if (context)
            context.close();
        context = new AudioContext();
        
        var beatsPerBar = 4 // Use 4/4 time
        var beatsPerMinute = 180 + 1.5 * (masteries['hecarim'] + masteries['masteryi'] + masteries['rammus'] + masteries['zilean']);
        var secondsPerBeat = 60.0 / beatsPerMinute;
        var currentBeat = 0;
        var currentTime = 0;
        
        var bassDrum = new BassDrum(context);
        var snareDrum = new SnareDrum(context);
        var bassInstrument = new Bass(context);
        var melodyInstrument = new SineTooth(context);
        
        //var test = new WhiteNoiseWithBandPass(context);
        //test.play({ startTime: 0.2, initialFrequency: 200, initialQ: 10, finalFrequency: 8, finalQ: 50, volume: 0.2, duration: 1 });
        
        // Have a slight delay before the start, otherwise the first note won't get played
        var startTime = 0.3;
        currentTime = startTime;

        // Intro
        /* Options:
          - SineTooth note only
          - Basic: start with bottom instruments and build up
          - Start with melody instrument only and add supporting lines later
          - Piano intro that transitions to electro
          - String ensemble that transitions to electro
          - Low bass note followed by drums
        */
        var introLength = 32;
        for (var i = 0; i < introLength; ++i) {
            // Play bass drum on 1 and 3
            if (i % 2 === 0)
                bassDrum.play(currentTime);
            if (currentBeat >= 16 && i % 4 === 2)
                snareDrum.play(currentTime);
            ++currentBeat;
            currentTime = currentBeat * secondsPerBeat + startTime;
        }
        currentBeat = 0;
        currentTime = startTime;
        var j = 0;
        var segment = song.segments[0];
        var measure = 0;
        var beatInMeasure = 0;
        while (currentBeat < introLength) {
            var rhythm = segment.bassLineRhythm[j % segment.bassLineRhythm.length];
            if (!rhythm.isRest) {
                // Play the root note of the chord
                var chord = segment.chordProgression[measure % segment.chordProgression.length];
                var frequency = frequencies[chord] / 4;
                bassInstrument.play(currentTime, frequency, rhythm.duration * secondsPerBeat);
            }
            currentBeat += rhythm.duration;
            beatInMeasure += rhythm.duration;
            currentTime = currentBeat * secondsPerBeat + startTime;
            while (beatInMeasure >= beatsPerBar) {
                ++measure;
                beatInMeasure -= beatsPerBar;
            }
            ++j;
        }
        
        // Body
        var bodyStartTime = currentTime;
        currentBeat = 0;
        currentTime = bodyStartTime;
        // Add drums
        for (var i = 0; i < song.form.length; ++i) {
            var segment = song.segments[song.form[i]];
            for (var j = 0; j < measuresPerSegment; ++j) {
                // Play bass drum on 1 and 3
                bassDrum.play(currentTime);
                bassDrum.play(currentTime + 2 * secondsPerBeat);
                // Snare on 3
                snareDrum.play(currentTime + 2 * secondsPerBeat);
                currentBeat += beatsPerBar;
                currentTime = currentBeat * secondsPerBeat + bodyStartTime;
            }
        }
        console.log(currentBeat);
        
        // Add bass line
        currentBeat = 0;
        currentTime = bodyStartTime;
        for (var i = 0; i < song.form.length; ++i) {
            var segment = song.segments[song.form[i]];
            var measure = 0;
            var beatInMeasure = 0;
            var j = 0;
            while (measure < measuresPerSegment) {
                var rhythm = segment.bassLineRhythm[j % segment.bassLineRhythm.length];
                if (!rhythm.isRest) {
                    // Play the root note of the chord
                    var chord = segment.chordProgression[measure % segment.chordProgression.length];
                    var frequency = frequencies[chord] / 4;
                    bassInstrument.play(currentTime, frequency, rhythm.duration * secondsPerBeat);
                }
                currentBeat += rhythm.duration;
                beatInMeasure += rhythm.duration;
                currentTime = currentBeat * secondsPerBeat + bodyStartTime;
                while (beatInMeasure >= beatsPerBar) {
                    ++measure;
                    beatInMeasure -= beatsPerBar;
                }
                ++j;
            }
        }
        console.log(currentBeat);
        
        // Add melody
        currentBeat = 0;
        currentTime = bodyStartTime;
        for (var i = 0; i < song.form.length; ++i) {
            var segment = song.segments[song.form[i]];
            for (var j = 0; j < segment.melodyNotes.length; ++j) {
                var rhythm = segment.melodyRhythm[j];
                if (!rhythm.isRest) {
                    var note = segment.melodyNotes[j];
                    melodyInstrument.play(currentTime, frequencies[note], rhythm.duration * secondsPerBeat);
                }
                currentBeat += rhythm.duration;
                currentTime = currentBeat * secondsPerBeat + bodyStartTime;
            }
        }
        console.log(currentBeat);
        
        var endingStartTime = currentTime;
        
        // Add backgrounds
        currentBeat = 0;
        currentTime = bodyStartTime;
        for (var i = 0; i < song.form.length; ++i) {
            var segment = song.segments[song.form[i]];
            for (var j = 0; j < segment.backgrounds.length; ++j) {
                var background = segment.backgrounds[j];
                var backgroundInstrument = getInstrument(background.instrument);
                var segmentStartBeat = i * measuresPerSegment * beatsPerBar;
                currentBeat = 0;
                currentTime = (currentBeat + segmentStartBeat) * secondsPerBeat + bodyStartTime;
                while (currentBeat < measuresPerSegment * beatsPerBar) {
                    for (var k = 0; k < background.rhythm.length; ++k) {
                        var rhythm = background.rhythm[k];
                        if (!rhythm.isRest) {
                            var options = copy(background.options);
                            options.startTime = currentTime;
                            options.duration *= secondsPerBeat;
                            backgroundInstrument.play(options);
                            if (options.multishots) {
                                for (var m = 0; m < options.multishots.length; ++m) {
                                    options = copy(background.options);
                                    options.startTime = currentTime + options.multishots[m] * secondsPerBeat;
                                    backgroundInstrument.play(options);
                                }
                            }
                        }
                        currentBeat += rhythm.duration;
                        currentTime = (currentBeat + segmentStartBeat) * secondsPerBeat + bodyStartTime;
                    }
                }
            }
        }
        
        // Add ending
        currentBeat = 0;
        currentTime = endingStartTime;
        for (var j = 0; j < song.ending.melodyNotes.length; ++j) {
            var rhythm = song.ending.melodyRhythm[j];
            if (!rhythm.isRest) {
                var note = song.ending.melodyNotes[j];
                melodyInstrument.play(currentTime, frequencies[note], rhythm.duration * secondsPerBeat);
            }
            currentBeat += rhythm.duration;
            currentTime = currentBeat * secondsPerBeat + endingStartTime;
        }
        var endingLength = currentBeat;
        currentBeat = 0;
        currentTime = endingStartTime;
        measure = 0;
        var j = 0;
        while (measure * beatsPerBar < endingLength) {
            var rhythm = song.ending.bassLineRhythm[j % song.ending.bassLineRhythm.length];
            if (!rhythm.isRest) {
                // Play the root note of the chord
                var chord = song.ending.chordProgression[measure % song.ending.chordProgression.length];
                var frequency = frequencies[chord] / 4;
                bassInstrument.play(currentTime, frequency, rhythm.duration * secondsPerBeat);
            }
            currentBeat += rhythm.duration;
            beatInMeasure += rhythm.duration;
            currentTime = currentBeat * secondsPerBeat + endingStartTime;
            while (beatInMeasure >= beatsPerBar) {
                ++measure;
                beatInMeasure -= beatsPerBar;
            }
            ++j;
        }
        
    }
    
    function buildAndPlay()  {
        var song = build();
        currentSong = song;
        play(song);
    }
    
    function stop()  {
        if (!context)
            return;
        context.close();
        context = null;
    }

    currentSong = build();
    
    return {
        build: build,
        play: play,
        buildAndPlay: buildAndPlay,
        stop: stop,
    }
})(
    Math.seedrandom
    //function mockSeedRandom() { return Math.random; }
);