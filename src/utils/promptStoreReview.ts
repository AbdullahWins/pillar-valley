import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import { Alert, Linking } from "react-native";

import { logEvent } from "@/src/lib/Analytics";

const { name } = Constants.expoConfig!;

function alertToReview() {
  Alert.alert(
    `Do you like ${name}?`,
    `Would you like to rate this app in the app store? It help's others discover ${name} too!`,
    [
      {
        text: "OK",
        onPress: () => Linking.openURL(StoreReview.storeUrl()!),
      },
      { text: "Cancel", onPress: () => {}, style: "cancel" },
    ],
    { cancelable: true }
  );
}

// Use an unintrusive prompt to ask the user if they like pillar valley,
// nothing happens if they say no.
// TODO: Bacon: Use a themed toast
async function askIfTheyLikeMeAsync(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Are you enjoying Pillar Valley?",
      undefined,
      [
        {
          text: "YA 😁",
          onPress: () => {
            resolve(true);
          },
        },
        {
          text: "Not really 🤷‍♂️",
          style: "cancel",
          onPress: () => {
            resolve(false);
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
  // const isAvailable = await StoreReview.isAvailableAsync()
}

export async function promptToReviewAsync(): Promise<boolean> {
  const likesMe = await askIfTheyLikeMeAsync();
  logEvent("prompted_about_liking", { likesGame: likesMe });
  if (!likesMe) {
    // TODO: Have a bug report thing
    return false;
  }

  const isAvailable = await StoreReview.isAvailableAsync();
  if (!isAvailable) {
    const storeUrl = StoreReview.storeUrl();
    if (!storeUrl) return false;
    if (!(await Linking.canOpenURL(storeUrl))) return false;
    await Linking.openURL(storeUrl);
  } else {
    await StoreReview.requestReview();
  }
  return true;
}
