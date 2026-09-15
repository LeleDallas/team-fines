import { useCallback } from "react";

import {
  useData,
} from "./useData";

import type { Player } from "../types";

export function usePlayers() {
  const {
    data,
    save,
    loading,
    saving,
  } = useData();

  const players = data.players;

  const addPlayer = useCallback(
    async (player: Player) => {
      await save({
        ...data,
        players: [
          ...data.players,
          player,
        ],
      });
    },
    [data, save],
  );

  const updatePlayer = useCallback(
    async (updatedPlayer: Player) => {
      await save({
        ...data,
        players: data.players.map(
          (player) =>
            player.name === updatedPlayer.name
              ? updatedPlayer
              : player,
        ),
      });
    },
    [data, save],
  );

  const deletePlayer = useCallback(
    async (player: Player) => {
      await save({
        ...data,
        players: data.players.filter(
          (item) =>
            item.name !== player.name,
        ),
      });
    },
    [data, save],
  );

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer,
    loading,
    saving,
  };
}