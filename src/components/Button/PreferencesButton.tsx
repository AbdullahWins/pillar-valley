import * as React from "react";

import Icon from "./Icon";

function PreferencesButton(props: React.ComponentProps<typeof Icon>) {
  return <Icon {...props} name="gear" fallback="cog" />;
}
export default PreferencesButton;
