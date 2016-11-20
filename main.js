
// Work out which excercise to show
const urlParams = deParam(window.location.search);
const exerciseName = urlParams.name || exercises[0].name;
/** here we match the exerciseName (from querystring) to the problem in exercise obj**/
const exercise = exercises.filter(exercise => exercise.name == exerciseName)[0];

console.log(urlParams, exerciseName);



$(document).ready(() => {
  // $('#problemsLink').prop('href', `problems?title=${exercise.title}`)
	  $('#title').text(exercise.title);
  $('#name').text(exercise.name);
  $('#problem').text(exercise.question);
  $('#answer').text('function '+exercise.name+'('+defaultInput(exercise.name)+'){\n\n}');

  for (var i = 0; i <= 2; i++) {
    var input = inputParser(exercise.inputs[i]);
    var result = solutions[exerciseName](...input);
    // TODO make this a class instead of an element
    $('.examples').append(`${exerciseName}${exercise.inputs[i]} → ${result}<br>`);
  }

  $('#solve').on('click', () => {
    $('tr').remove();
    const answer = $('#answer').val();

    console.log(answer);
    eval(`var ans=${answer}`);

    const inputs = exercise.inputs;
    console.log('inpute: ', inputs);

    let results = []
    inputs.forEach((inputStr) => {
      const input = inputParser(inputStr);
      const result = ans(...input);
      console.log(input);
      const idealResult = solutions[exerciseName](...input);
      $('#tests').append(formatResults(exerciseName, inputStr, idealResult, result));
      console.log('result: ', result);

      var isCorrect = _.isEqual(result,idealResult)
      results.push(isCorrect)
    });

    if (Math.min(...results) == 1){
      $('.congrats').text("100% Passing. Well Done!")
    }

  });

  $('#next').on('click', () => {
    var indx = _.findIndex(exercises, {name: exerciseName})+1;
    var x = exercises[indx];
    window.location.search = `?name=${x.name}&title=${x.title}`
  })

  $('#previous').on('click', () => {
    var indx = _.findIndex(exercises, {name: exerciseName})-1;
    var x = exercises[indx];
    window.location.search = `?name=${x.name}&title=${x.title}`
  })


  $('#show').on('click', () => {
    var s = solutions[exerciseName].toString();
    var r = new RegExp(/function/);
    var n = s.replace(r, `function ${exercise.name}`)
    $('#mySolution').text(n)
  })
});
