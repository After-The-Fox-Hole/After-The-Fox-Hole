
const functions = {}

functions.commentLoop = async (comments, votes, master, masterText) =>{
	
		const loopOne =(arr)=>{
			let a = []
			
			for (let x of arr){
				if (x.attach.length === 0){
					a.push(x);
				}
			}
			return a
		}
		
		let result = loopOne(comments)
		
		const loopTwo = (arr,arrM) =>{
			for (let x of arrM) {
				for (let y of arr) {
					if(x.attach.length>0) {
						if (x.attach[0].valueOf() === y._id.valueOf()) {
							if (!y.nested) {
								y.nested = [x]
							} else {
								if (!y.nested.includes(x)) {
									y.nested.push(x)
								}
							}
							y.nested = loopTwo(y.nested, comments)
						}
					}
				}
			}
			return arr
		}
		
		result = loopTwo(result,comments)
		
		const commentLoop = (arr, html, count)=>{
			
			arr = arr.sort(function(x,y){
				if (x.votes > y.votes){
					return -1;
				}
				if (x.votes < y.votes){
					return +1;
				}
				if (x.timeCreated > y.timeCreated){
					return -1;
				}
				if (x.timeCreated < y.timeCreated){
					return +1;
				}
				
				
				
				
			})
			for (let x of arr){
				let votedL = false;
				if(votes.includes(x._id.valueOf())){
					votedL = true;
				}
				html = html + `<div class="border my-1 p-2 theseAreCards rounded" style="margin-left: ${count}em">
									<div class="row">
										<div class="col-md-10">
											<a href="/profile?id=${x.owner.id}">
												<p class="commentContent">${x.owner.name}</p>
											</a>
										</div>
										<div class="col-md-2">
											<p>Votes: ${x.votes}</p>
										</div>
									</div>
									<div class="commentContent mb-2">${x.content}</div>
									<div>
									<form action="/comments/add" method="post">
									
									</form>
									<div class="d-flex ">
									<div class="voteable voteDiv ms-auto">
									<form action="/vote" method="post">
										<input class="visually-hidden" name="master" value="${master._id}">
										<input class="visually-hidden" name="attach" value="${x._id}">
										<input class="visually-hidden" name="type" value="${masterText}">
										<input class="visually-hidden scrollField" name="scroll" value="">
										<button class="pt-2 pb-1 hideOnComment navBtnStyle voteBtn `;
				if(votedL){
					html = html + "voted"
				}
				html = html + `" 
									type="submit">UPVOTE</button>
										<input class="visually-hidden" name="value" value="`;
				if(votedL){
					html = html + "-1"
				}
				else{
					html = html + "+1"
				}
				html = html + `">
									</form>
									</div>
									<form class="formReply" action="/comments/add" method="post">
										<input class="visually-hidden" name="master" value="${master._id}">
										<input class="visually-hidden" name="attach" value="${x._id}">
										<input class="visually-hidden" name="type" value="${masterText}">
										<input class="visually-hidden scrollField" name="scroll" value="">
										<div class="visually-hidden makeComment d-flex flex-grow-1 me-2">
											<textarea class="flex-fill" name="content" rows="3" type="text"></textarea>
										</div>
										<button class="pt-2 pb-1 visually-hidden makeComment reset navBtnStyle" type="submit">SUBMIT</button>
										<button class="pt-2 pb-1 visually-hidden makeComment closeComment navBtnStyle" type="button">CANCEL</button>
									</form>
									
									<button class="btn-sm openComment hideOnComment navBtnStyle pt-2 pb-1 ">REPLY</button>
									</div>
									</div>
								</div>`
				if(x.nested){
					if(count < 17){
						html = commentLoop(x.nested, html, count+4)
					}
					else{
						html = commentLoop(x.nested, html, count)
					}
				}
			}
			return html
		}
		let cHtml = "";
		cHtml = commentLoop(result, cHtml, 0);
		return cHtml

}



module.exports = functions;
