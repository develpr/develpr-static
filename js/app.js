// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function(){

	$('.hide-the-code').on('click', function(event){
		event.preventDefault();
		$('.code-snippet').toggleClass('hide-for-small');
		$('.hide-the-code i').toggleClass('fi-arrows-out').toggleClass('fi-arrows-in');
	});

	$(".off-canvas-list").html($('.large-menu ul').html());

	var draw = SVG('me-here')
	var images = ["sai.jpg"];
	var image = draw.image('img/' + images[Math.floor(Math.random() * images.length)]).size(100, 100);
	var circle = draw.circle(100,100);

	image.clipWith(circle);

	var gitHubResultJson = null;

	$.ajax({
		type: "GET",
		url: "https://api.github.com/users/develpr",
		dataType: "json",
		crossDomain: true,
		complete: function(data){

			var userJSON = data.responseJSON;
			var reposCount = userJSON.public_repos;
			var reposURL = userJSON.repos_url + "?sort=pushed";
			var userURL = userJSON.html_url;

			$.ajax({
				type: "GET",
				url: reposURL,
				dataType: "json",
				crossDomain: true,
				complete: function(data){

					if(!data.responseJSON){
						return;
					}



					var reposJSON = data.responseJSON;
					var commitsURL = reposJSON[0].commits_url.replace("{/sha}","");

					var lastCommitDate = new Date(reposJSON[0].updated_at);
					var lastCommitDate = (lastCommitDate.getMonth()+1) + "/" + lastCommitDate.getDate() + "/" + lastCommitDate.getFullYear();

					$.ajax({
						type: "GET",
						url: commitsURL,
						dataType: "json",
						crossDomain: true,
						complete: function(data){

							if(!data.responseJSON){
								return;
							}

							commitsJSON = data.responseJSON;
							console.log(commitsJSON);

							var commitMessage = "";
							var commitURL = "";

							$.each(commitsJSON, function(index, item){
								if(item.author.login == "develpr"){
									commitMessage = commitsJSON[0].commit.message;
									commitURL = commitsJSON[0].html_url;
									return;
								}
								if(commitURL.length > 0)
									return;
							});

							$('.repositories a').attr('href', userURL).html(reposCount);
							$('.commitDate a').attr('href', commitURL).html(lastCommitDate);
							$('.commitMessage a pre').attr('href', commitURL).text(commitMessage);

							//show the card
							$('.github-card').removeClass('hide');
						}
					});

				}
			});
		}
	});

});