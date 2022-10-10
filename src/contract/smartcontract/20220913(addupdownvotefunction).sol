// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
    pragma abicoder v2;
    import "./base.sol";
/// @title A Decentralised Social Media Platform
/// @author Mohit Bhat
/// @notice You can use this contract to connect to decentralised social network, share your content to the world in a decentralised way!
/// @dev Most of the features are implemented keeping note of security concerns

contract MyBoard is Ownable{
    using SafeMath for uint256;
    // address payable public owner; //Owner is also a maintainer    
    ERC20 public MESA;    
    
    struct User{ 
        string username; 
        string profileImgUrl;           
    }
    struct Channel{
        uint256 channelId;
        string name; 
        address creater;
        string contentUrl;
        string iconImgUrl;
        string topics;  
        uint256 joincount;
        uint256 postcount;        
        uint256 timestamp;      
    }
    
    struct Post{
        uint256 channelId;
        uint256 postId;
        address creator;        
        string title;
        string contentUrl;  
        string encryptkey;
        uint256 commentcount;  
        uint256 votes; 
        uint256 votecount;
        postTypes postType;
        postSorts postSort;
        uint256 awardCount;  
        uint256 timestamp;
               
    }
    
    struct Comment{
        uint256 commentId;
        address creator;
        uint256 postId;
        string contentUrl; 
        string encryptkey;
        uint256 subcommentcount;
        uint256 votes;
        uint256 votecount;
        uint256 parentCommentId;
        uint256 awardCount;          
        uint256 timestamp;     
    }
    uint256 public totalChannels=0;
    uint256 public totalPosts=0;
    uint256 public totalComments=0;

    uint256 public privatePostCost=500*10**18;
    uint256 public paidPostCost=500*10**18;
    uint256 public paidPostViewCost=100*10**18;
    uint256 public awardTokenAmount=100*10**18;

    address public adminAddress=address(0x4cd1df8fF1bE578301232c9e730c41410613F038);
    
 
    enum voteStatus{None,VoteUp,VoteDown}
    enum postTypes{Public, Private,Paid}
    enum postSorts{Post, Image,Link,Poll}

  
    
    mapping(address=>User) private users; //mapping to get user details from user address   
    mapping(address=>bool) private userDeactivate; //mapping to get user details from user address   
    mapping (uint256=>Channel) private channels;//maping to get chanel from ID    
   
    mapping (address=>mapping(uint256=>bool)) private channelMemberState; //channel member state of channel
    mapping(uint256=>Post) private posts;// mapping to get post from Id       
    mapping(uint256=>string) private privatePostKey; // mapping to get post private key state from Id     
    mapping(address=>mapping(uint256=>bool)) private paidPostReadPermitted ;// Mapping user permit stated of paid post content    
    mapping(uint256=>Comment) private comments; //Mapping to get comment from comment Id    
    mapping(address=>mapping(uint256=>voteStatus)) private postVote; // Mapping user/(post or comment)/voteup state
    mapping(address=>mapping(uint256=>voteStatus)) private commentVote; // Mapping user/(post or comment)/voteup state   
    mapping(address=>mapping(uint256=>uint256)) private userPollVoteId; // Mapping user/postid/vote id
    mapping(uint256=>mapping(uint256=>uint256)) private VotesOfpostPollItem; //Mapping poastid/pollid/ votes count
    mapping(uint256=>uint256) private postPollItemCount; 
    mapping(uint256=>uint256) private postPollVoteExpireTime; // Mapping post poll vote expire time

    mapping(address=>mapping(uint256=>uint256)) private userPostAwards;  //Mapping awared state of user about postId
    mapping(address=>mapping(uint256=>uint256)) private userCommentAwards;   
    // modifier onlyOwner{require(msg.sender==owner,"You are not owner!"); _;}
    modifier onlyChannelOwner(uint256 channelId){require(msg.sender==channels[channelId].creater,"You are not channel owner!"); _;}

    modifier onlyActiveUser(address user){require(!userDeactivate[user],"Not a Registered User!");_;}
    modifier onlyActiveChannel(uint256 channelid){require((channelid<totalChannels+1)&&(channelid>0),"channel is not correct");_; } 
    modifier onlyActivePost(uint256 id){require((id>0)&&(id<totalPosts+1),"Not a active post"); _;}
    modifier onlyActiveComment(uint256 id){require((id>0)&&(id<totalComments+1),"Not a active comment");     _;}
    // modifier checkUserNotExists(address user){require(users[user].status==accountStatus.NP,"User already registered"); _;} 
   
    event profileUpdate(string username,string profileImgUrl,uint256 timestamp);
    event newChannelCreated(string channelName,uint256 channelId,address creator,string iconImgUrl,uint256 timestamp);
    event channelSettingUpdated(uint256 channelId,address creator,string  iconImgUrl, string topics, uint256 timestamp);
    event channelJoined(bool joinedState,uint256 channelId,uint256 joincount,address joiner,uint256 timestamp );     
    event newPostCreated(uint256 channelId,uint256 postId,string title,uint256 channelpostcount,address creator,string postType,uint256 timestamp );
    event awardToThePost(uint256 channelId,uint256 postId,uint256 awardcount,address postcreator,address awarduser,uint256 timestamp );
    event postReadAllowed(uint256 channelId,uint256 postId,address creator,address allowedUser,uint256 timestamp);
    event voteToPost(uint256 channelId,uint256 postId,uint256 votes,uint256 votecount,address user,voteStatus votedstate,uint256 timestamp ); 
    event pollVote(uint256 channelId,uint256 postId,uint256 votenum,address user,uint256 pollid,uint256 timestamp);
    event writeSubCommentToComment(uint256 ChannelId,uint256 postId, uint256 parentCommentId, uint256 commentId,uint256 subcommentcount,address postcreator,address creator,uint256 timestamp);
    event writeCommentToPost(uint256 ChannelId,uint256 postId, uint256 commentId,uint256 commentcount,address postcreator,address creator,uint256 timestamp);
    event awardToTheComment(uint256 channelId,uint256 postId,uint256 commentId,uint256 awardcount,address commentcreator,address awarduser,uint256 timestamp  );
     event voteToComment(uint256 channelId,uint256 postId,uint256 commentId,uint256 votes,uint256 votecount,address user,voteStatus votedstate,uint256 timestamp );
         
 
   


    
    constructor() {
        // owner=msg.sender;
    
        // registerUser("owner","owner","","","owner");
        //  MESA=ERC20(address(0x76e1C2ce6997A4C129Df88e0189bB9b5D3B5E349));//moonbean
        // MESA=ERC20(address(0x9E5EAFeD952136C87eaB9D29ab64D6e63534E091));//ploygon
        //MESA=ERC20(address(0x067a37347f4188a0e16759303827d8143e0Ff0Df));//TestBNB
    }
    
    fallback() external{
        revert();
    }

    function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool){
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }  

    function SetMESATokenAddress(address MESAAddress) public onlyOwner(){
        MESA=ERC20(MESAAddress);
    }

  
    /// @notice Register a new usere
    function setUserProfile(string memory _username,  string memory _profileImgUrl) public{      
                  
        users[msg.sender]=User(_username,_profileImgUrl);  
        emit profileUpdate(_username,_profileImgUrl,block.timestamp);
 
    }    
    /// @notice Get user details
    function getUserProfile(address _user) public view
    returns(User memory user){
        return(users[_user]);
    }


/*
**************************************DWEET FUNCTIONS***********************************************************
*/  
    /// @notice Create a new channel
    function createChannel(string memory _channelName,string memory _contentUrl,string memory _iconImgUrl)public  onlyActiveUser(_msgSender()){  
        totalChannels=totalChannels+1;       
        channels[totalChannels]=Channel(totalChannels,_channelName,msg.sender,_contentUrl,_iconImgUrl,"",0,0,block.timestamp);      
        emit newChannelCreated(_channelName,totalChannels,msg.sender,_iconImgUrl,block.timestamp);
    } 
    function editChannel(uint256 channelId,string memory _contentUrl,string memory _iconImgUrl,string memory _topics)public  onlyActiveUser(_msgSender())  onlyActiveChannel(channelId){ 
        require(channels[channelId].creater==msg.sender,"you are not owner"); 
        channels[channelId].contentUrl=_contentUrl;   
        channels[channelId].iconImgUrl=_iconImgUrl;    
        channels[channelId].topics=_topics; 
        emit channelSettingUpdated(channelId,msg.sender,_iconImgUrl,_topics,block.timestamp);
    } 
    /// @notice join channel
    function JoinChannel(uint256 _channelId) public  onlyActiveUser(msg.sender) { 
        if(channelMemberState[msg.sender][_channelId]){
            require(channels[_channelId].joincount>0,"error  joincount");
            channelMemberState[msg.sender][_channelId]=false;  
            channels[_channelId].joincount=channels[_channelId].joincount.sub(1);               
            emit channelJoined(false,_channelId,channels[_channelId].joincount,msg.sender,block.timestamp);
        }else{      
            channelMemberState[msg.sender][_channelId]=true;     
            channels[_channelId].joincount=channels[_channelId].joincount.add(1);    
            emit channelJoined(true,_channelId,channels[_channelId].joincount,msg.sender,block.timestamp);
        }      
    }   

    function getChannelInf(uint256 _channelId)  public  onlyActiveChannel(_channelId) 
     view returns(Channel memory channelInf,bool joined ){           
        return (channels[_channelId],channelMemberState[msg.sender][_channelId]);
    }
    /// @notice Create a new post   
    function createPost(uint256 _channelId,string memory _privateKey, string memory title,string memory _contentUrl,string memory _encryptkey, postTypes _postType,postSorts _postSort,uint256 _pollCount,uint256 _expireTime)
     public  onlyActiveUser(_msgSender()) onlyActiveChannel(_channelId){    
         string memory posttypeStr="public";   
       
        if (_postType==postTypes.Paid){//paid post
            require(MESA.allowance(msg.sender,address(this))>=paidPostCost ,
                "there is no enough approved token amount for create paid post");
            require(MESA.balanceOf(msg.sender)>=paidPostCost,
                "there is no enough token balance for create paid post");
             MESA.transferFrom(msg.sender, adminAddress, paidPostCost);
             posttypeStr="paid";
        }else if(_postType==postTypes.Private){
             require(MESA.allowance(msg.sender,address(this))>=privatePostCost ,
            "there is no enough approved token amount for create private post");
            require(MESA.balanceOf(msg.sender)>=privatePostCost,
                "there is no enough token balance for create private post");
            MESA.transferFrom(msg.sender, adminAddress, privatePostCost);
             posttypeStr="private";
        }
        totalPosts=totalPosts.add(1);
        uint256 id=totalPosts;
        posts[id]=Post(_channelId,id,msg.sender,title,_contentUrl,_encryptkey,0,0,0,_postType,_postSort,0,block.timestamp );
    
      

        if(_postType==postTypes.Private){
            privatePostKey[id]=_privateKey;                  
        }      
      
        if(_postSort==postSorts.Poll){
            for (uint256 i=1;i<=_pollCount;i++){
                 VotesOfpostPollItem[id][i]=0;
            }
            postPollItemCount[id]=_pollCount;
          postPollVoteExpireTime[id]=block.timestamp+_expireTime* 1 days;
        }       
        channels[_channelId].postcount=channels[_channelId].postcount+1; 
        uint256 postcount=channels[_channelId].postcount;
        emit newPostCreated(_channelId,totalPosts,title,postcount,msg.sender,posttypeStr,block.timestamp );
    }
     
    function awardToPost(uint256 _id)public  onlyActiveUser(msg.sender)onlyActivePost(_id) {
        require(msg.sender!=posts[_id].creator,"You can't award your post");
        require(MESA.allowance(msg.sender,address(this))>=awardTokenAmount ,
                "there is no enough approved token amount in order to viewing paid content");
        require(MESA.balanceOf(msg.sender)>=awardTokenAmount,
            "there is no enough token balance in order to viewing paid content");
        MESA.transferFrom(msg.sender, address(posts[_id].creator), awardTokenAmount);
        posts[_id].awardCount= posts[_id].awardCount.add(1);     
        userPostAwards[msg.sender][_id]=userPostAwards[msg.sender][_id].add(1);  
        emit awardToThePost(  posts[_id].channelId,_id,posts[_id].awardCount, posts[_id].creator, msg.sender, block.timestamp );
    }   
    function paidPostReadAllow(uint256 _postId) public onlyActiveUser(_msgSender()) {
        require(MESA.allowance(msg.sender,address(this))>=paidPostViewCost ,
                "there is no enough approved token amount in order to viewing paid content");
        require(MESA.balanceOf(msg.sender)>=paidPostViewCost,
            "there is no enough token balance in order to viewing paid content");
        MESA.transferFrom(msg.sender, address(posts[_postId].creator), paidPostViewCost);
        paidPostReadPermitted[msg.sender][_postId]=true;
      
        emit postReadAllowed(posts[_postId].channelId,_postId,posts[_postId].creator,msg.sender,block.timestamp);
    }
        /// @notice Like a posts 
    /// @param _id Id of post or comment 
    function postVoteUpSet(uint256 _id) public onlyActiveUser(_msgSender()) onlyActivePost(_id){        
        uint256 v_num=1;    
        posts[_id].votecount= posts[_id].votecount.add(1) ;    
        if(postVote[msg.sender][_id]==voteStatus.None){
            posts[_id].votes=posts[_id].votes.add(1);
            postVote[msg.sender][_id]=voteStatus.VoteUp;  
        }else if(postVote[msg.sender][_id]==voteStatus.VoteDown){
            posts[_id].votes=posts[_id].votes.add(2);
            postVote[msg.sender][_id]=voteStatus.VoteUp;
            v_num=2;
        }
        else{
             posts[_id].votes=posts[_id].votes.sub(1);
            postVote[msg.sender][_id]=voteStatus.None;                    
        }
             
        emit voteToPost( posts[_id].channelId,_id, posts[_id].votes,posts[_id].votecount,msg.sender,postVote[msg.sender][_id],block.timestamp  ); 
    }
    /// @notice unLike a posts
    /// @param _id Id of post to be unlikePost  
    function postVoteDownSet(uint256 _id) public onlyActiveUser(_msgSender()) onlyActivePost(_id){ 
         Post memory selPost=posts[_id];   
        require(selPost.votes>0,"you can't updown vote"); 
             
        uint256 v_num=1;        
        posts[_id].votecount= posts[_id].votecount.add(1);    
         if(postVote[msg.sender][_id]==voteStatus.None){
            selPost.votes=selPost.votes.sub(1);
            postVote[msg.sender][_id]=voteStatus.VoteDown;           
        }else if(postVote[msg.sender][_id]==voteStatus.VoteDown){
            selPost.votes=selPost.votes.add(1);
            postVote[msg.sender][_id]=voteStatus.None;           
        }
        else{
            if(selPost.votes>2){
                selPost.votes=selPost.votes.sub(2);               
                postVote[msg.sender][_id]=voteStatus.VoteDown;
                 v_num=2;
            }else if(selPost.votes==2){
                selPost.votes=selPost.votes.sub(2);
                postVote[msg.sender][_id]=voteStatus.None;
                 v_num=2;
            }else{
                selPost.votes=selPost.votes.sub(1);
                postVote[msg.sender][_id]=voteStatus.None;
            } 
        }
        emit voteToPost( posts[_id].channelId,_id, posts[_id].votes,posts[_id].votecount,msg.sender,postVote[msg.sender][_id],block.timestamp  ); 
    } 
    /// @notice unLike a posts
    function postPollVote(uint256 _postid,uint256 _pollid) public onlyActiveUser(_msgSender()) onlyActivePost(_postid){
        require(block.timestamp<=postPollVoteExpireTime[_postid],"vote time is expired");
        require(posts[_postid].postSort==postSorts.Poll,"This is not poll vote");
        require(!(userPollVoteId[msg.sender][_postid]>0),"you have already vote!");
        require(_pollid>0 && _pollid<= postPollItemCount[_postid],"Poll Id id not coreect");
        userPollVoteId[msg.sender][_postid]=_pollid;
        VotesOfpostPollItem[_postid][_pollid]=VotesOfpostPollItem[_postid][_pollid].add(1);   
        emit pollVote(posts[_postid].channelId,_postid, VotesOfpostPollItem[_postid][_pollid],msg.sender, _pollid,block.timestamp);
    } 

    /// @notice Get a Post  
    function getPost(uint256 _id,string memory _privatekey) public  view 
            returns ( Post memory postDetailInf){   
        Post memory selPost=posts[_id];                    
        if(selPost.postType==postTypes.Public||msg.sender==selPost.creator||
        (selPost.postType==postTypes.Private&&compareStringsbyBytes(privatePostKey[_id],_privatekey))
        ||(selPost.postType==postTypes.Paid&&paidPostReadPermitted[msg.sender][_id])){  
        }else {                        
            selPost.contentUrl='';     
            selPost.encryptkey='';        
        }
        return (selPost);
    }

    function getPostOtherInf(uint256 _id) public  
    view returns (bool paidstate,voteStatus voteState,string memory channelName,uint256 userAwards) {        
        return (paidPostReadPermitted[msg.sender][_id],postVote[msg.sender][_id],
        channels[posts[_id].channelId].name,userPostAwards[msg.sender][_id]);
    }

    /// @notice unLike a posts
  
    function getPostPollVoteInf(uint256 _postid) public  
    view returns (uint256[] memory votes,uint256 userVotedPollId ){       
        uint256[] memory voteCountList = new uint256[](postPollItemCount[_postid]);
        for (uint256 i=0;i<postPollItemCount[_postid];i++){
            voteCountList[i]=VotesOfpostPollItem[_postid][i+1];
          }      
        return (voteCountList,userPollVoteId[msg.sender][_postid]);
    }
      

    function checkPrevivatekey(uint256 _postid, string memory _privatekey)public view
    returns(bool checkedstate )
    {
        return (compareStringsbyBytes(privatePostKey[_postid],_privatekey));
    }   

/*
**************************************COMMENT FUNCTIONS*************************************************************************
*/ 
    /// @notice Create a comment on post
    function createComment(uint256 _postid,string memory _contentUrl,string memory _encryptkey,uint256 _commentid,string memory _privatekey) public  onlyActiveUser(_msgSender())  onlyActivePost(_postid){
        require(_commentid>=0,"commentId must be euqaul or more than 0");       
        if(posts[_postid].creator!=msg.sender){            
            if(posts[_postid].postType==postTypes.Paid){
                require(paidPostReadPermitted[msg.sender][_postid],"you are not permitted to view this post");
            }else if(posts[_postid].postType==postTypes.Private){
                require(compareStringsbyBytes(privatePostKey[_postid],_privatekey), "not correct private key");
            }
        }
     
        totalComments=totalComments.add(1);
        uint256 id=totalComments;
        comments[id]=Comment(id, msg.sender, _postid, _contentUrl,_encryptkey,0, 0,0,_commentid,0, block.timestamp);       
        if(_commentid>0){
          comments[_commentid].subcommentcount=comments[_commentid].subcommentcount.add(1);

          emit writeSubCommentToComment(posts[_postid].channelId,_postid,_commentid,totalComments,comments[_commentid].subcommentcount,posts[_postid].creator,msg.sender,block.timestamp);
        }else{
         
          posts[_postid].commentcount=posts[_postid].commentcount.add(1);
           
          emit writeCommentToPost(posts[_postid].channelId,_postid,totalComments,posts[_postid].commentcount,posts[_postid].creator,msg.sender,block.timestamp);
        }     
    }

    function awardToComment(uint256 _id)public  onlyActiveUser(msg.sender) onlyActiveComment(_id) {
        require(msg.sender!=comments[_id].creator,"You can't award your post");
        require(MESA.allowance(msg.sender,address(this))>=awardTokenAmount ,
                "there is no enough approved token amount in order to viewing paid content");
        require(MESA.balanceOf(msg.sender)>=awardTokenAmount,
            "there is no enough token balance in order to viewing paid content");
        MESA.transferFrom(msg.sender, address(comments[_id].creator), awardTokenAmount);
        comments[_id].awardCount= comments[_id].awardCount.add(1);       
        userCommentAwards[msg.sender][_id]=userCommentAwards[msg.sender][_id].add(1);
        emit awardToTheComment(posts[comments[_id].postId].channelId,comments[_id].postId,comments[_id].awardCount,_id,comments[_id].creator,msg.sender,block.timestamp  );
    }
    /// @notice Get a comment
    function getComment(uint256 _id,string memory _privatekey) public view  
    returns(Comment memory commentDetailInf){        
        if(posts[comments[_id].postId].creator!=msg.sender){
            if(posts[comments[_id].postId].postType==postTypes.Private){
                require(compareStringsbyBytes(privatePostKey[comments[_id].postId],_privatekey), "not correct private key");
            }else if(posts[comments[_id].postId].postType==postTypes.Paid){
                require(paidPostReadPermitted[msg.sender][comments[_id].postId],"you are not permitted to view this post");
            }
        }
        return(comments[_id]);
    }

    /// @notice Get a comment
    
   
    function getCommentOtherInf(uint256 _id) public view  
    returns(voteStatus voteState,uint256 userAwards){              
        return(commentVote[msg.sender][_id],userCommentAwards[msg.sender][_id]);
    }        
     /// @notice Like a comment  
    function commentVoteUpSet(uint256 _id) public onlyActiveUser(_msgSender()) onlyActiveComment(_id){
        string memory v_type="upvote";
         uint256 v_num=1; 
          comments[_id].votecount= comments[_id].votecount.add(1); 
        if(commentVote[msg.sender][_id]==voteStatus.None){
            comments[_id].votes=comments[_id].votes.add(1);
            commentVote[msg.sender][_id]=voteStatus.VoteUp;
           
        }else if(commentVote[msg.sender][_id]==voteStatus.VoteDown){
            comments[_id].votes=comments[_id].votes.add(2);
            commentVote[msg.sender][_id]=voteStatus.VoteUp;
            v_num=2;
        }
        else{
             comments[_id].votes=comments[_id].votes.sub(1);
            commentVote[msg.sender][_id]=voteStatus.None;
            v_type="downvote";
        }
      
        emit voteToComment(posts[comments[_id].postId].channelId,comments[_id].postId,_id,comments[_id].votes, comments[_id].votecount, msg.sender,commentVote[msg.sender][_id],block.timestamp );
    }
    /// @notice unLike a comment
    /// @param _id Id of comment to be unlikecomment
    function commentVoteDownSet(uint256 _id) public onlyActiveUser(_msgSender()) onlyActiveComment(_id){
        require(comments[_id].votes>0,"vote count is bellow zero");
         string memory v_type="downvote";
         uint256 v_num=1;  
         comments[_id].votecount= comments[_id].votecount.add(1); 
         if(commentVote[msg.sender][_id]==voteStatus.None){
            comments[_id].votes=comments[_id].votes.sub(1);
            commentVote[msg.sender][_id]=voteStatus.VoteDown;
           
        }else if(commentVote[msg.sender][_id]==voteStatus.VoteDown){
            comments[_id].votes=comments[_id].votes.add(1);
            commentVote[msg.sender][_id]=voteStatus.None;
            v_type="upvote";
        }
        else{       
            if(comments[_id].votes>2){
                comments[_id].votes=comments[_id].votes.sub(2);
                postVote[msg.sender][_id]=voteStatus.VoteDown;
                v_num=2;
            } else if (comments[_id].votes==2){
                    comments[_id].votes=comments[_id].votes.sub(2);
                    postVote[msg.sender][_id]=voteStatus.None;
                    v_num=2;
            }else{
                comments[_id].votes=comments[_id].votes.sub(1);
                postVote[msg.sender][_id]=voteStatus.None;
                v_num=1;
            }
        }
       emit voteToComment(posts[comments[_id].postId].channelId,comments[_id].postId,_id,comments[_id].votes, comments[_id].votecount, msg.sender,commentVote[msg.sender][_id],block.timestamp );
    }           

/*
****************************************Owner Admin ******************************************************************************************
*/
    /// @notice Get balance of contract 
    /// @return balance balance of contract
    function getBalance()public view onlyOwner() returns(uint256 balance){
        return address(this).balance;
    }
    
    /// @notice Withdraw contract funds to owner
    /// @param _amount Amount to be withdrawn
    function transferContractBalance(uint256 _amount)public payable onlyOwner(){
        require(_amount<=address(this).balance,"Withdraw amount greater than balance");
        msg.sender.transfer(_amount);
    }
    function setAdminAddress(address newAdmin) public onlyOwner(){
        adminAddress=newAdmin;
    }
    // function transferMessaToken(address toAddr,uint256 _amount)public onlyOwner(){
    //      require(MESA.balanceOf(address(this))>=_amount,
    //             "there is no enough token balance for create paid post");
    //     MESA.transfer(toAddr,_amount); 

    // }
    // function getMessaTokenBalance() public view onlyOwner() returns(uint256 value){        
    //     return MESA.balanceOf(address(this));
    // }

    function setCost(string memory costType, uint256 cost) public onlyOwner(){
        if(compareStringsbyBytes(costType,"privatePostCost")){
            privatePostCost=cost;
        }else if(compareStringsbyBytes(costType,"paidPostCost")){
            paidPostCost=cost;
        }else if(compareStringsbyBytes(costType,"paidPostViewCost")){
            paidPostViewCost=cost;
        }else if(compareStringsbyBytes(costType,"awardTokenAmount")){
            awardTokenAmount=cost;
        }

    }



    

}