window.addEventListener("message",(n=>{if(console.log(n),n.data.advertiserDomain===n.origin&&null!=n.data.dynIg.owner)for(const e of n.data.dynIg.igs){const d={owner:n.data.dynIg.owner,name:`${e.name.cpnId}_${e.name.catId??""}`,biddingLogicUrl:"https://fledge.dynalyst.jp/generate-bid/index.js",trustedBiddingSignalsUrl:"https://fledge.dynalyst.jp/getvalues",trustedBiddingSignalsKeys:[e.name.cpnId],userBiddingSignals:{lastVisitedAt:Date.now(),eventType:e.eventType,enableAuction:n.data.enableAuction},ads:e.ads,adComponents:e.adComponents};navigator.joinAdInterestGroup(d,604800)}}));