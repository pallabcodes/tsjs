// basic recursion
function loop(start: number, end: number = 5) {
  console.log(start);
  if (start < end) {
    loop(start + 1, end);
  }
}

/*
* recursive call : pushState: recurse(4)  popState : returns 5
* recursive call : pushState: recurse(3)  popState : returns 4
* recursive call : pushState: recurse(2)  popState : returns 3
* recursive call : pushState: recurse(1)  popState : returns 2
* default   call : pushState: recurse(1)  popState : returns 1
* main / global execution context()
* */
loop(1, 5);

function loopReverse(n: number): void {
  console.log(n);
  if (n > 0) {
    loopReverse(n - 1);
  }
}


/*
* pushState: recurse(1)  popState : returns 1
* pushState: recurse(2)  popState : returns 2
* pushState: recurse(3)  popState : returns 3
* pushState: recurse(4)  popState : returns 4
* pushState: recurse(5)  popState : returns 5
* main / global execution context()
* */
loopReverse(5);

function sum(n: number): number {
  if (n <= 1) {
    return n;
  }
  return n + sum(n - 1);
}


/*
    * recursive call: n = 1 so : popState: return  1
    * recursive call: pushState 2 + sum( 2 - 1) : popState: return 2 + 1 = 3
    * recursive call: pushState 3 + sum( 3 - 1) : popState: return  3 + 3 = 6
    * recursive call: pushState 4 + sum( 4 - 1) : popState: return  4 + 6 = 10
    * default call: pushState 5 + sum( 5 - 1) : popState: return  5 + 10 = 15
    * */

sum(7);

function arraySum(numbers: Array<number>): number {
  if (numbers.length === 1) {
    return numbers[0]!;
  } else {
    /*
    * pushState: [5] : popState = number[0] i.e. 5
    * * 4 + [5] : popState: 4 + 5 = 9
    * * 2 + [4, 5 ] : popState: 2 + 9 = 11
    * 1 + [2, 4, 5] : popState: 1 + 11 = 12
    * */
    return numbers[0]! + arraySum(numbers.slice(1));
  }
}

console.log(arraySum([1, 2, 4, 5]));


// advanced

// without recursion
function fibonacci(n: number, array: number[] = [0, 1]): number[] {
  while (n > 2) {
    const [nextToLast, last] = array.slice(-2);
    // @ts-ignore
    array.push(nextToLast + last);
    n -= 1;
  }
  return array;
}

console.log(fibonacci(12));

const fibo = (num: number, array: number[] = [0, 1]): number[] => {
  if (num <= 2) return array;
  const [nextToLast, last] = array.slice(-2);
  // @ts-ignore
  return fibo(num - 1, [...array, nextToLast + last]);
};
console.log(fibo(12));

// what number is at nth position of fibonacci sequence

const fibonacciPos = (pos: number) => {
  if (pos <= 1) return pos;
  const seq = [0, 1];
  for (let i = 2; i <= pos; i++) {
    const [nextToLast, last] = seq.slice(-2);
    // @ts-ignore
    seq.push(nextToLast + last);
  }
  return seq[pos];
};

console.log(fibonacciPos(8));

const fibPos = (pos: number): number => {
  if (pos < 2) return pos;
  return fibPos(pos - 1) + fibPos(pos - 2);
};

/*
*     recursive call : fibPos(1) return 1
*     recursive call : fibPos(2 - 1 = 1)
*     recursive call : fibPos(3 - 1 = 2)
*     recursive call : fibPos(4 - 1 = 3)
*     recursive call : fibPos(5 - 1 = 4)   +   fibPost(2 - 2 = 0)
*     recursive call : fibPos(6 - 1 = 5)   +   fibPost(4 - 2 = 2)
*     recursive call : fibPos(7 - 1 = 6)   +   fibPost(6 - 2 = 4)
*     recursive call : fibPos(8 - 1 = 7)   +   fibPost(8 - 2 = 6)
* default call : fibPos(pos = 8)
* Global Execution context/main
* */
console.log(fibPos(8));


const getAwsProductIdImages = async (productId: string, s3: unknown, resultArray: any[], data: { isTruncated: boolean, NextContinuationToken: any }): Promise<unknown> => {
  if (data.isTruncated) {
    return await getAwsProductIdImages(productId, s3, resultArray, data.NextContinuationToken);
  }
  return resultArray;
};

const artistByGenre = {
  jazz: [`Miles`, `John`],
  rock: {
    classic: ["Bob", "Eagles"],
    hair: ["bowl", "long"],
    alt: {
      classic: ["pearl", "coldplay"],
      current: ["joy", "fly"]
    }
  },
  unclassified: {
    new: ["camp", "neil"],
    classic: ["seal", "chris"]
  }
};

const getArtistNames = (dataObj: Record<string, any>, arr: any[] = []) => {
  Object.keys(dataObj).forEach(key => {
    if(Array.isArray(dataObj[key])) {
      return dataObj[key].forEach((artist: any) => {
        arr.push(artist);
      })
    }
    getArtistNames(dataObj[key], arr);
  })
  return arr;
}
console.log(getArtistNames(artistByGenre));

function combinations (elements: string[], size: number): any[] {
  let result = [];
  if(size === 0) {
    result.push([]);
  } else {
    combinations(elements, size - 1).forEach((prev) => {
      elements.forEach((element) => {
        result.push([element].concat(prev))
      })
    })
  }
  return result;

}
let combs = combinations(["a", "b", "c", "d"], 3);
console.log(combs);


function nested(i: number, j: number, jj: number): void {
  if (i == 0 && j == 0) {
    console.log(i, j);
    return;
  }
  if (j == 0) {
    nested(i - 1, jj, jj);
  } else {
    nested(i, j - 1, jj);
  }
  console.log(i, j);
}
nested(4, 4, 4);

const copyTo = (source: typeof sourceJson, destination: typeof targetJson) => {
  for (const key in source) {
    // @ts-ignore
    const sourceValue = source[key]
    const isObject = !!sourceValue && typeof sourceValue === 'object'
    if (isObject) {
      const destinatonHasEntry = key in destination

      if (destinatonHasEntry === false) {
        // create the entry (plain object or array)
        // @ts-ignore
        destination[key] = Array.isArray(sourceValue) ? [] : {}
      }

      // @ts-ignore
      copyTo(sourceValue, destination[key])
    } else {
      // sourceValue is a primitive value
      // @ts-ignore
      destination[key] = sourceValue
    }
  }
}

let targetJson = {
  "idp-cms-feed": {
    "feedID": "09adfe0a-aba2-3d3b-a826-5a1c9d26670e",
    "feedTimeStamp": "2021-03-25T15:45:58.083-0500",
    "myorders": {
      "analytics": {
        "lineOfBusiness": "general"
      },
      "configuration": {
        "enablePersonalization": true
      },
      "seo": {
        "disableBreadCrumbs": false,
        "twittercard": "summary",
        "metaRobots": "INDEX,FOLLOW"
      },
      "pageinfo": {
        "lineOfBusiness": "general",
        "releaseName": "2103d,2103c,2103b,2101b",
        "releasePath": "/idpassets/fragment/services"
      },
      "ogtype": "website",
      "disableBreadcrumb": "false",
      "lob": "general",
      "breadcrumbStatus": "auto",
      "contentFragments": {
        "orderInfo": {
          "master": {
            "title": "Order details",
            "orderNumber": "Order #",
            "orderDate": "Ordered:",
            "ceaseTitle": "Cancellation info",
            "returnToOrderSummaryLinkLabel": "Return to Order summary",
            "shippingAddressLabel": "Shipping address:",
            "variationID": "25c344dd-145b-3bed-9d06-6696c9563377",
            "testt": "ttttt",
          }
        },
        "equipment": {
          "master": {
            "accordianTitle": "Equipment",
            "IHXAccordianTitle": "Delivery and setup info",
            "attTvEquipmentTitle": "AT&T TV equipment",
            "attTvNowEquipmentTitle": "AT&T TV NOW equipment",
            "singleStreamingDevice": "device",
            "multiStreamingDevice": "devices",
            "estimatedShipDateLabel": "Expected to ship:",
            "shippedOnDateLabel": "Shipped on:",
            "estimatedDeliveryDateLabel": "Expected to deliver:",
            "deliveredOnDateLabel": "Delivered on:",
            "trackingLabel": "tracking #:",
            "addressLabel": "Address:",
            "variationID": "36652467-454d-3184-b961-e0dad29cd483"
          }
        },
        "carrierTracker": {
          "master": {
            "shipmentInfoLabel": "SHIPMENT INFO",
            "returnShippingStatusLabel": "Return shipping status:",
            "deliveredStatus": "Delivered",
            "outForDeliveryStatus": "Out for delivery",
            "inTransitStatus": "In transit",
            "inTransitText": "Last scan at",
            "carrierPickedUpStatus": "Carrier picked up",
            "disclaimerText": "*Local time shown",
            "variationID": "f5d74d7a-2166-3802-9a6a-a5e63e9ba49c",
            "carrierTrackerErrorLabel": "Oops! We had a system glitch and can’t show your shipping info. Try refreshing your screen. If that doesn’t work, give it some time and try again later."
          }
        },
        "tradeIn": {
          "master": {
            "tradeInAlert": "We see your order includes a trade-in. Be sure to send us your used device within 30 days after you activate your new one. Look for the  <a target = '_self' role = \"link\" aria-label=\\\"Trade in section\\\"  href = '#TradeIn'> trade-in info</a> for more details.",
            "tradeInHeader": "Trade in",
            "tradeInCountText": "Trade-in devices:",
            "attTradeInText": "AT&T TRADE-IN",
            "tradeInKitText": "<b>Trade-in kit</b>",
            "tradeInProcessText": "Have questions about the trade-in process?",
            "tradeInLink": "https://tradein.att.com/trade-in-status",
            "tradeInAnswersText": "Get answers",
            "nextStepsLabel": "Next steps",
            "nextStepsList": [
              "Sign up for an eligible AT&T unlimited plan to qualify for the promo.",
              "Wait for your shipping kit to arrive in 5 - 7 days. It ships separately from your new device.",
              "Review and complete the tasks outlined in the Pre-shipping checklist.",
              "Use the trade-in shipping kit to send us your old device."
            ],
            "preShippingLabel": "Pre-shipping checklist",
            "preShippingList": [
              "Back up or transfer personal info to a different device.",
              "Turn off activation locks.",
              "Remove SIM and memory cards.",
              "Perform factory reset to delete personal info from device."
            ],
            "importantDetailsLabel": "Important details",
            "importantDetailsList": [
              "Send us your old device within 30 days from activating your new device.",
              "Don’t use the return labels included with your new device.",
              "Each trade-in device must be mailed in its own shipping kit.",
              "The trade-in device can’t be returned to you.",
              "Any remaining data on your old device isn't recoverable."
            ],
            "seeDetailsLinkLabel": "See Details",
            "seeDetailsLink": "https://tradein.att.com/offer-details",
            "startedLabel": "Started",
            "reaturnedLabel": "In transit",
            "pendingLabel": "Pending",
            "waitingLabel": "Waiting",
            "receivedLabel": "Received",
            "completedLabel": "Completed",
            "packageReceivedLabel": "Package received",
            "canceledLabel": "Canceled",
            "tradeInItemName": "Package for [[itemName]]",
            "tradeInKitName": "Your trade-in: [[itemName]]",
            "invoiceLabel": "Confirmation #:",
            "tradeInPromoText": "Trade-in promo:",
            "tradeInEstimatedLabelText": "Estimated trade-in value:",
            "tradeInEstimatedValueDisclaimerText": "*You’ll receive the trade-in value as an AT&T promotional card. Use the card to buy products at any AT&T-owned store or on att.com. You can also use it to pay your AT&T wireless bill.",
            "finalTradeinOfferValueText": "Final trade-in offer value:",
            "monthlyBillCreditText": "Monthly bill credit:",
            "billCreditStartDateText": "Bill credit start date:",
            "tradeInPromoValueText": "Up to $[[promoValue]] off with qualifying trade-in*",
            "tradeInDisclaimerText": "*We apply monthly credits over the term of the installment plan. Credits start within three bill periods. Depending upon your trade-in device, you may receive an AT&T Promotion Card or one-time credit instead.",
            "tradeInStartedInstructionsText": "*We apply monthly credits over the term of the installment plan. Credits start within three bill periods. Depending upon your trade-in device, you may receive an AT&T Promotion Card or one-time credit instead.",
            "tradeInStartedInstructionsText1": "Need to get a replacement trade-in kit or print your labels? Go to ",
            "tradeInInstructionsLabel": "Trade-in instructions",
            "tradeInStartedInstructionsText2": "Steps to trade in your device",
            "tradeInStartedBoxText": "1. Get your return label",
            "tradeInStartedBoxDesc": "You’ll get your return shipping label in one of three ways: In the box your new device came in, in a trade-in kit we send you, or in an email we send you. If you get an email, look for a link to print a return label.",
            "tradeInStartedChecklistText": "2. Prep your device for shipment",
            "tradeInStartedChecklistDesc": "For the best experience, be sure to get your trade-in device ready to send it to us.",
            "learnHowLinkLabel": "Learn how",
            "tradeInStartedPersonalDeliveryText": "3. Drop off your package",
            "tradeInStartedPersonalDeliveryDesc": "Use the label you received to drop your device off at the post office. If you printed the label from an email we sent, you'll drop it off at a UPS location instead.",
            "tradeInDetailsLabel": "More details",
            "tradeInDetailsStartedInstructionsText3": "How to prep your trade-in device",
            "tradeInDetailsStartedInstructionsText3List": [
              "Back up or transfer personal info to a different device.",
              "Turn off activation locks (like Find My iPhone or Find My Device).",
              "Remove SIM and memory cards.",
              "Perform a factory reset to delete personal info from the device."
            ],
            "tradeInDetailsStartedInstructionsText4": "Important info",
            "tradeInDetailsStartedInstructionsText4List": [
              "Make sure to send in your used device within 30 days from activating your new one.",
              "Use the shipping label we provided you."
            ],
            "tradeInDetailsStartedInstructionsText5": "<b>Good to know:</b><br>The trade-in device can’t be returned to you. Plus, any data that's still on your used device isn't recoverable.<br>",
            "tradeInDetailsCompletedInstructionsText1List": [
              "We inspected your trade-in device and determined it qualifies for $[[tradeinValue]] in promo credits.",
              "You’ll start seeing the monthly promo credits on your bill within three bill periods. The credits will apply over the term of the installment plan. [[viewBill]]",
              "Have questions? Call us at 800.331.0500."
            ],
            "viewYourBillLable": "View your bill",
            "viewYourBillLink": "https://www.att.com/acctmgmt/billandpay",
            "shipmentInfoLabel": "Shipment info",
            "returnedOnLabel": "Returned on:",
            "shippedOnLabel": "Shipped on:",
            "tradeInReturnedReceivedInstruText1": "Keep in mind, the trade-in device can’t be returned to you.",
            "tradeInReturnedReceivedInstruText2": "Have questions about the trade-in process? Go to",
            "receivedOnLabel": "Received on:",
            "tradeInLinkLabel": "tradein.att.com/trade-in-status",
            "tradeInOfferLabel": "Get more trade-in details",
            "seeTradeInDetailsLinkLabel": "See trade-in details",
            "devicePhoneLabel": "Number associated with the trade-in:",
            "tradeInStatusLabel": "Trade-in status:",
            "tradeInHeaderLabel": "Test",
            "variationID": "c254f71f-1793-38dd-a17f-0e544da0f303",
            "instructionsTradeInLinkLabel": "tradein.att.com",
            "instructionsTradeInLink": "https://tradein.att.com"
          }
        }
      }
    },
    "feedVersion": "210324135254"
  }
};

let sourceJson = {
  "orderInfo": {
    "master": {
      "title": "Testttt title",
      "orderNumber": "Order #",
      "orderDate": "Ordered:",
      "ceaseTitle": "Cancellation info",
      "returnToOrderSummaryLinkLabel": "Return to Order summary",
      "shippingAddressLabel": "Shipping address:",
      "serviceAddressLabel": "Service address is",
      "onPageLoadSpinnerContent": "Hang on…we’re getting your order info",
      "billingAddressLabel": "Billing address:",
      "snagTitle": "Oops! We hit a snag.",
      "eSimShippingLabel": "Ship to:",
      "tvCashCarryOrderLabel": "Ordered on:",
      "chckTitle": "Congrats on your purchase!",
      "variationID": "25c344dd-145b-3bed-9d06-6696c9563377"
    }
  }
};

copyTo(sourceJson, targetJson)

console.log(targetJson)
