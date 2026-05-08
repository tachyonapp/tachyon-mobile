import { rings } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

const AVATAR_SIZE = 60;

interface BotAvatarProps {
  seed: string | null;
  backgroundColor: string;
}

export const BotAvatar = ({ seed, backgroundColor }: BotAvatarProps) => {
  const avatarSvg = useMemo(
    () => createAvatar(rings, { seed: seed || "default" }).toString(),
    [seed],
  );

  return (
    <View style={[styles.previewAvatar, { backgroundColor: backgroundColor }]}>
      <SvgXml xml={avatarSvg} width={AVATAR_SIZE} height={AVATAR_SIZE} />
    </View>
  );
};

const styles = StyleSheet.create({
  previewAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 8,
    overflow: "hidden",
  },
});
