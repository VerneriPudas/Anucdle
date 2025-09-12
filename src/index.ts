import { Game } from "./game/Game";
import { DomController } from "./ui/DomController";

const game = new Game();
const ui = new DomController(game);

ui.bindEvents();
