// FUNCTION FOR COUNTING AMOUNT OF SYLLABLES
// Function sourced from: https://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript

// Don't really understand how the code actually works, but basically it reads through the word, and firstly scans whether it's less than 3. 
// - if not then it follows through a couple lines of code which are different rules for measuring syllables. 

// function new_count(word) {
//     word = word.toLowerCase();                                     //word.downcase!
//     if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
//       word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
//       word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
//       return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
//   }


// FUNCTION THAT ENABLES THE PARALLAX EFFECT IN THE HEADER
// Function and other associated code sourced from: https://medium.com/@PatrykZabielski/how-to-make-multi-layered-parallax-illustration-with-css-javascript-2b56883c3f27

(function() {
    window.addEventListener('scroll', function(event) {
        var depth, i, layer, layers, len, movement, topDistance, translate3d;
        topDistance = this.pageYOffset;
        layers = document.querySelectorAll("[data-type='parallax']");
        for (i = 0, len = layers.length; i < len; i++) {
            layer = layers[i];
            depth = layer.getAttribute('data-depth');
            movement = -(topDistance * depth);
            translate3d = 'translate3d(0, ' + movement + 'px, 0)';
            layer.style['-webkit-transform'] = translate3d;
            layer.style['-moz-transform'] = translate3d;
            layer.style['-ms-transform'] = translate3d;
            layer.style['-o-transform'] = translate3d;
            layer.style.transform = translate3d;
        }
    });

}).call(this);


// CODE FOR INTERACTIVE VISUALIZATION

// Code that sets up the config argument towards the bottom.
// It makes sure that the plotly displayBar doesn't appear, and makes the graph responsive to the page. 

const config = {
    displayModeBar: false,
    responsive: true
}

// Intilizes the only instance of the graph, and places graph inside the assigned div.

const interactiveViz = document.getElementById("interactiv-vis");

// Function that creates the entire graph

Plotly.d3.csv("data/data_version2.csv", function(rows) {

    // Two variables that will be used in the hovertemplate to measure the count of the words. 

    var trumpAmt = unpack(rows, 'trump_count');
    var obamaAmt = unpack(rows, 'obama_count');

    // Trace for Trump Data, using trump-frequency and trump-syllable as the x and y values.
    // Simple scatter plot setup, using both text and customdata for extra data to be added into the hovertemplate.

    var dataTrump = {
        x: unpack(rows, 'trump_frequency'),
        y: unpack(rows, 'trump_syllable'),
        mode: 'markers',
        type: 'scatter',
        name: 'Trump  ',
        text: trumpAmt,
        customdata: unpack(rows, 'trump_word'),
        hovertemplate: "Word: <b>%{customdata}</b><br>" +
            "Used: %{text} times<br>" +
            "Syllables: %{y}<br>" +
            "<extra></extra>",
        marker: {
            size: 10,
            color: '#DF1E19'
        }
    }

    // Trace for Obama Data, identical setup to Trump's Data trace. 

    var dataObama = {
        x: unpack(rows, 'obama_frequency'),
        y: unpack(rows, 'obama_syllable'),
        mode: 'markers',
        type: 'scatter',
        name: 'Obama   ',
        text: obamaAmt,
        customdata: unpack(rows, 'obama_word'),
        hovertemplate: "Word: <b>%{customdata}</b><br>" +
            "Used: %{text} times<br>" +
            "Syllables: %{y}<br>" +
            "<extra></extra>",
        marker: {
            size: 10,
            color: '#0752E5'
        }
    }

    // Creates an array containing both data traces, and allows it fulfill one argument of the Plotly function. 

    var vizData = [dataTrump, dataObama];

    // Similarly, another argument need in the Plotly function - 'layout'. 
    // Used to setup the visuals of the graph, in particularly changing axis lables, positioning of legend and colours. 

    var visLayout = {
        width: 800,
        paper_bgcolor: 'none',
        plot_bgcolor: 'none',
        hovermode: 'closest',
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 1,
            xanchor: 'right',
            y: 1,
            bgcolor: '#FFFFFF',
            bordercolor: '#000000',
            borderwidth: 0.2
        },
        font: {
            family: "EBGaramond-Italic",
            color: "#000000",
        },
        yaxis: {
            title: 'Complexity of Word (Syllables)',
        },
        xaxis: {
            title: 'Frequency of  Word being Used (%)'
        }
    }

    // The function that generates the interactive visualization. 
    // Intakes all the previously established variables as arguments. 

    Plotly.newPlot(interactiveViz, vizData, visLayout, config);

});

// Simple function that reads through the csv file and returns the value of the cell it's just read and enables it to be passed through into the graph data. 

function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}


// CODE THAT CREATES THE DROP-DOWN MENU INTERACTION
// This code was based/sourced from: https://stackoverflow.com/questions/59954761/html-javascript-make-text-appear-when-dropdown-menu-option-selected

// This function ensures that the option selected from the dropdown menu, sends the correct text/data to the correct div.

function optionClicked() {

    // Variable used to get the value/option chosen by the user, and will be measured against the options in the following set of 'if' statements. 

    let userPicked = document.getElementById("dropdown-list").value;

    // Variables to establish locations for where certain pieces of text will go in the html. 

    var trumpTweet = document.getElementById("dropdown-tweets-trump");
    var obamaTweet = document.getElementById("dropdown-tweets-obama");
    var trumpDate = document.getElementById('dropdown-tweets-trump-date');
    var obamaDate = document.getElementById('dropdown-tweets-obama-date');

    // A long series of 'if' and 'else if' statements that assign each option in the dropdown, a corresponding tweet from both Obama and Trump.
    // The 'innerHTML' then sends that text in between the >< parts of the assigned div. 
    // <span id="vis-wordunderline"> was used to highlight the word in the tweet being compared / the word chosen by the user.  
    // Not the most efficient in that it doesn't scan through a CSV file, but still gets the job done. 

    if (userPicked == 'president') {
        trumpTweet.innerHTML = "If Joe Biden were <span id='vis_wordunderline'>President</span>, you wouldn't have the Vaccine for another four years, nor would the <span id='vis_hashtagorat'>@US_FDA</span> have ever approved it so quickly. The bureaucracy would have destroyed millions of lives!";
        trumpDate.innerHTML = "09.11.2020"
        obamaTweet.innerHTML = "<span id='vis_wordunderline'>President</span> Obama: I'm not going to cut things like education. I'm not going to cut research that helps our economy.<br><br><br><br>";
        obamaDate.innerHTML = "18.10.2012";
    } else if (userPicked == 'great') {
        trumpTweet.innerHTML = "<span id='vis_wordunderline'>Great</span> to be in Ohio, leaving now for Wisconsin. See you in a little while! ";
        trumpDate.innerHTML = "24.10.2020"
        obamaTweet.innerHTML = "A trip to Alaska could be <span id='vis_wordunderline'>great</span> motivation to join the fight to <span id='vis_hashtagorat'>#ActOnClimate</span>. Enter now:";
        obamaDate.innerHTML = "15.12.2015";
    } else if (userPicked == 'all') {
        trumpTweet.innerHTML = "Thank you LIBERTARIANS. We are getting it <span id='vis_wordunderline'>all</span> done, and FAST! VOTE TRUMP!!!";
        trumpDate.innerHTML = "16.10.2020";
        obamaTweet.innerHTML = "Countries <span id='vis_wordunderline'>all</span> over the world are standing <span id='vis_hashtagorat'>#UnitedOnClimate</span>, join the conversation to be part of this historic moment.";
        obamaDate.innerHTML = "12.02.2015";
    } else if (userPicked == 'people') {
        trumpTweet.innerHTML = "THE COVID DRUGS NOW AVAILABLE TO MAKE <span id='vis_wordunderline'>PEOPLE</span> BETTER ARE AMAZING, BUT SELDOM TALKED ABOUT BY THE MEDIA! Mortality rate is 85% down!";
        trumpDate.innerHTML = "19.11.2020"
        obamaTweet.innerHTML = "'Every year, we spend $80 billion in taxpayer dollars to keep <span id='vis_wordunderline'>people</span> incarcerated.' —President Obama";
        obamaDate.innerHTML = "31.10.2014";
    } else if (userPicked == 'thank') {
        trumpTweet.innerHTML = "<span id='vis_wordunderline'>Thank</span> you LIBERTARIANS. We are getting it all done, and FAST! VOTE TRUMP!!!";
        trumpDate.innerHTML = "16.10.2020";
        obamaTweet.innerHTML = "'We can never <span id='vis_wordunderline'>thank</span> you enough.' <br>—President Obama addressing the troops <span id='vis_hashtagorat'>#JoiningForces</span>";
        obamaDate.innerHTML = "15.12.2014";
    } else if (userPicked == 'news') {
        trumpTweet.innerHTML = "This is good <span id='vis_wordunderline'>news</span>, it means I won! <br>cc: <span id='vis_hashtagorat'>@RepDougCollins @SecretarySonny</span>";
        trumpDate.innerHTML = "10.11.2020";
        obamaTweet.innerHTML = "Big <span id='vis_wordunderline'>news</span>: More than 200 U.S. companies are supporting the President's plan to cut carbon pollution from power plants.";
        obamaDate.innerHTML = "12.03.2014";
    } else if (userPicked == 'country') {
        trumpTweet.innerHTML = "...AND I WON THE ELECTION. VOTER FRAUD ALL OVER THE <span id='vis_wordunderline'>COUNTRY!</span> ";
        trumpDate.innerHTML = "18.11.2020";
        obamaTweet.innerHTML = "'Generations of immigrants have made this <span id='vis_wordunderline'>country</span> what it is. It's what makes us special.' —President Obama <span id='vis_hashtagorat'>#ImmigrationAction</span>";
        obamaDate.innerHTML = "21.11.2014";
    } else if (userPicked == 'big') {
        trumpTweet.innerHTML = "Polls numbers are looking very strong. <span id='vis_wordunderline'>Big</span> crowds, great enthusiasm. Massive RED WAVE coming!!!";
        trumpDate.innerHTML = "16.10.2020";
        obamaTweet.innerHTML = "This is a <span id='vis_wordunderline'>big</span> moment in the fight against climate change' stick it to climate change deniers by adding <br>your name.";
        obamaDate.innerHTML = "14.10.2014";
    } else if (userPicked == 'get') {
        trumpTweet.innerHTML = "Georgia, <span id='vis_wordunderline'>get</span> out and VOTE for two great Senators, <span id='vis_hashtagorat'>@KLoeffler</span> and <span id='vis_hashtagorat'>@sendavidperdue</span>. So important to do so!";
        trumpDate.innerHTML = "12.09.2020";
        obamaTweet.innerHTML = "It's time: <span id='vis_hashtagorat'>#With1010</span>, both the economy and American workers <span id='vis_wordunderline'>get</span> a hand.";
        obamaDate.innerHTML = "10.10.2014";
    } else if (userPicked == 'democrats') {
        trumpTweet.innerHTML = "The <span id='vis_hashtagorat'>@US_FDA</span> and the <span id='vis_wordunderline'>Democrats</span> didn't want to have me get a Vaccine WIN, prior to the election, so instead it came out five days later. As I've said all along!";
        trumpDate.innerHTML = "12.09.2020";
        obamaTweet.innerHTML = "'Today, I applaud the efforts of <span id='vis_wordunderline'>Democrats</span> in the House to give immigration reform the yes-or-no <br>vote it deserves.' —President Obama";
        obamaDate.innerHTML = "26.03.2014";
    } else if (userPicked == 'new') {
        trumpTweet.innerHTML = "Our Economy is doing great, and is ready to set <span id='vis_wordunderline'>new</span> records - best ever (Again!). Biden will destroy everything with his massive Tax Increases. Don't let it happen!!!";
        trumpDate.innerHTML = "24.10.2020";
        obamaTweet.innerHTML = "LIVE: President Obama is announcing a <span id='vis_wordunderline'>new</span> initiative called 'My Brother's Keeper' for young men of color. Watch here:";
        obamaDate.innerHTML = "27.02.2014";
    } else if (userPicked == 'would') {
        trumpTweet.innerHTML = "Defunding Police <span id='vis_wordunderline'>would</span> be good for Robbers & Rapists. <span id='vis_hashtagorat'>@SenBillCassidy</span>";
        trumpDate.innerHTML = "09.06.2020";
        obamaTweet.innerHTML = "'I said this year <span id='vis_wordunderline'>would</span> be a year of action. And I meant it' —President Obama <span id='vis_hashtagorat'>#OpportunityForAll</span>";
        obamaDate.innerHTML = "02.12.2020";
    } else if (userPicked == 'time') {
        trumpTweet.innerHTML = "The restaurant business is being absolutely decimated. Congress should step up and help. <span id='vis_wordunderline'>Time</span> is of the essence!";
        trumpDate.innerHTML = "27.11.2020";
        obamaTweet.innerHTML = "It's <span id='vis_wordunderline'>time</span> for Congress to <span id='vis_hashtagorat'>#ActOnReform</span>. Take a stand:";
        obamaDate.innerHTML = "02.05.2014";
    } else if (userPicked == 'today') {
        trumpTweet.innerHTML = "Great meeting <span id='vis_wordunderline'>today</span> with the CoronaVirus Task Force in the Oval Office. Stay informed at: <span id='vis_hashtagorat'>https://t.co/p9j7kZsD7b</pan>";
        trumpDate.innerHTML = "08.04.2020";
        obamaTweet.innerHTML = "225 years ago <span id='vis_wordunderline'>today</span>: George Washington was elected to be the first president of the United States.";
        obamaDate.innerHTML = "02.04.2014";
    } else if (userPicked == 'america') {
        trumpTweet.innerHTML = "MAKE AMERICA GREAT AGAIN!";
        trumpDate.innerHTML = "31.10.2020";
        obamaTweet.innerHTML = "'If every child is successful ... then the America my child grows up in will be more successful.' —President Obama <span id='vis_hashtagorat'>#OpportunityForAll</span>";
        obamaDate.innerHTML = "30.01.2014";
    } else if (userPicked == 'many') {
        trumpTweet.innerHTML = "I paid <span id='vis_wordunderline'>many</span> millions of dollars in Taxes to the Federal Government, most of which was even paid early, or PREPAID. MANY $MILLIONS. The Failing <span id='vis_hashtagorat'>@nytimes</span> never likes reporting that!";
        trumpDate.innerHTML = "31.10.2020";
        obamaTweet.innerHTML = "For <span id='vis_wordunderline'>many</span> Americans, the Affordable Care Act means getting health insurance for the first time. <br>Listen up: <span id='vis_hashtagorat'>@NPR</span>";
        obamaDate.innerHTML = "16.02.2014";
    } else if (userPicked == 'make') {
        trumpTweet.innerHTML = "<span id='vis_wordunderline'>MAKE</span> AMERICA GREAT AGAIN!";
        trumpDate.innerHTML = "31.10.2020";
        obamaTweet.innerHTML = "'We want to <span id='vis_wordunderline'>make</span> sure more young people have the chance to earn a higher education.' —President Obama <span id='vis_hashtagorat'>#CollegeOpportunity</span>";
        obamaDate.innerHTML = "16.02.2014";
    } else if (userPicked == 'never') {
        trumpTweet.innerHTML = "A total FRAUD. Statehouse Republicans, proud, strong and honest, will <span id='vis_wordunderline'>never</span> let this travesty stand!";
        trumpDate.innerHTML = "26.11.2020";
        obamaTweet.innerHTML = "'I'll <span id='vis_wordunderline'>never</span> stop fighting to help more hardworking Americans know the economic security of health care.' <br>—President Obama";
        obamaDate.innerHTML = "26.10.2013";
    } else if (userPicked == 'vote') {
        trumpTweet.innerHTML = "Great people. <span id='vis_wordunderline'>Vote</span> for Trump!";
        trumpDate.innerHTML = "25.10.2020";
        obamaTweet.innerHTML = "It's time for the House to <span id='vis_wordunderline'>vote</span> on #immigration reform to strengthen our economy and our communities. <span id='vis_hashtagorat'>#JustFixIt</span>";
        obamaDate.innerHTML = "22.10.2013";
    } else if (userPicked == 'congress') {
        trumpTweet.innerHTML = "The restaurant business is being absolutely decimated. <span id='vis_wordunderline'>Congress</span> should step up and help. Time is of the essence!";
        trumpDate.innerHTML = "27.11.2020";
        obamaTweet.innerHTML = "In Tennessee today, President Obama challenged <span id='vis_wordunderline'>Congress</span> to pass a real jobs plan for the middle class. <span id='vis_hashtagorat'>#ObamaNooga</span>";
        obamaDate.innerHTML = "30.07.2013";
    } else if (userPicked == 'election') {
        trumpTweet.innerHTML = "Georgia will be a big presidential win, as it was the night of the <span id='vis_wordunderline'>Election!</span>";
        trumpDate.innerHTML = "9.11.2020";
        obamaTweet.innerHTML = "Winning an <span id='vis_wordunderline'>election</span> won't bring about the change we seek on its own.";
        obamaDate.innerHTML = "01.06.2013";
    } else if (userPicked == 'because') {
        trumpTweet.innerHTML = "China is on a massive disinformation campaign <span id='vis_wordunderline'>because</span> they are desperate to have Sleepy Joe Biden win the presidential race so they can continue to rip-off the United States, as they have done for decades, until I came along!";
        trumpDate.innerHTML = "21.05.2020";
        obamaTweet.innerHTML = "'<span id='vis_wordunderline'>Because</span> our workplaces have changed, we have to change with them.' —President Obama <span id='vis_hashtagorat'>#EqualPayNow</span>";
        obamaDate.innerHTML = "16.04.2015";
    } else if (userPicked == 'china') {
        trumpTweet.innerHTML = "Totally Negative <span id='vis_wordunderline'>China</span> Virus Reports. Hit it early and hard. Fake News is devastated. They are very bad (and sick!) people!";
        trumpDate.innerHTML = "13.10.2020";
        obamaTweet.innerHTML = "<span id='vis_hashtagorat'>#ClimateChangeIsReal</span>. So is the historic agreement between the U.S. and <span id='vis_wordunderline'>China</span> last fall to cut carbon pollution.";
        obamaDate.innerHTML = "22.04.2015";
    } else if (userPicked == 'nothing') {
        trumpTweet.innerHTML = "The Do <span id='vis_wordunderline'>Nothing</span> Democrats have disgraced our great Country! ";
        trumpDate.innerHTML = "19.11.2019";
        obamaTweet.innerHTML = "'There's <span id='vis_wordunderline'>nothing</span> principled about the idea of another government shutdown.' —President Obama";
        obamaDate.innerHTML = "19.09.2015";
    } else if (userPicked == 'house') {
        trumpTweet.innerHTML = "Here we go again, another Con Job by the Do Nothing Democrats. All of this work was supposed to be done by the <span id='vis_wordunderline'>House</span>, not the Senate!";
        trumpDate.innerHTML = "15.01.2020";
        obamaTweet.innerHTML = "President Obama on <span id='vis_hashtagorat'>#immigration</span>: 'Republicans in the <span id='vis_wordunderline'>House</span> should stop dragging their feet and get this done.'";
        obamaDate.innerHTML = "08.06.2013";
    } else {
        alert('You must pick an option.');
    }
}