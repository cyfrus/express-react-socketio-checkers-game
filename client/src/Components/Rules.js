import React from "react";
import OldImage1 from "../images/oldPicture1.jpg";
import NormalBoard from "../images/normalBoard.jpg";


class Rules extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
        <h1>About</h1>
        <p className="rulesParagraph">
          Checkers is actually the American version of an internationally
          popular game called Draughts (pronounced "drafts") which has a number
          of different variants. The game is incredibly old and has a
          fascinating history. It has also been the focus of several inventive
          computer programmers interested in artificial intelligence.
        </p>
        <div>
          <img className="image normalBoard" src={NormalBoard}/>
        </div>
        <h4>The History of Checkers</h4>
        <p className="rulesParagraph">
          The first Checkers-like playing board was discovered by archaeologists
          in a dig in Mesopotamia (now Iraq) in the city of Ur.
        </p>
        <p className="rulesParagraph">
          Carbon dating showed the board to be from about 3000 BCE, or more than
          5000 years old.
        </p>
        <div className="text-center imgContainer">
        <img className="image OldImage1" src={OldImage1} />
        </div>
        
        <p> 
          While the rules of Mesopotamian Checkers are unknown, historians do
          know the rules of an ancient Egyptian Checkers game called Alquerque.
          This game may have originated about 1400 BCE, and was popular until
          the Middle Ages.
        </p>
        <p className="rulesParagraph">
          In 1100 CE, a new version of Checkers, Fierges, was invented by a
          Frenchman. This version, played on a chess board, was generally played
          by women (much as Mah Jong is played today).
        </p>
        <p className="rulesParagraph">
          Around 1500, the first books were written about the game which was now
          called Draughts. In 1847, the first Draughts and Checkers
          championships were played with formal awards given. Changes were made
          to the rules because advanced players gained an advantage by playing
          first. More tweaks to the rules helped make the game more consistent
          across locations and playing situations.
        </p>
        <h4>Computers, AI, and Checkers</h4>
        <p className="rulesParagraph">
          Like chess, checkers has always been interesting to computer
          programmers because it is a game of mathematical possibilities.
        </p>
        <p className="rulesParagraph">
          The very first computer program built to play Checkers was created in
          1952 by programmer Arthur L. Samuel. Since then, many more advanced
          and complex Checkers programs have been developed; some have defeated
          even very advanced players.
        </p>
        <p className="rulesParagraph">
          Samuel created the first Checkers program that was used by a computer.
          Gradually, these game programs were improved as computer speed and
          capacities increased. Today, computer programs rely more on database
          information that shows every possible move combinations when 10 pieces
          remain on the board and less on strategies. Checkers has entered
          practically every home through the Internet and has played to a draw
          and sometimes, even defeated the best players. Checkers continues to
          be as popular as ever and people all over the world play different
          versions of the game to entertain themselves, strengthen their powers
          of logic or simply enjoy quality time playing a good game at home with
          the family.
        </p>
        <h4>How to Play Standard American Checkers</h4>
        <p className="rulesParagraph">
          While rules vary from country to country, these rules apply to
          American Checkers, a game that is played at every level by both
          children and adults.
        </p>
        <h6>Game Basics</h6>
        <p className="rulesParagraph">
          Checkers is played by two players. Each player begins the game with 12
          colored discs. (Typically, one set of pieces is black and the other
          red.) Each player places his or her pieces on the 12 dark squares
          closest to him or her. Black moves first. Players then alternate
          moves. The board consists of 64 squares, alternating between 32 dark
          and 32 light squares.
        </p>
        <p className="rulesParagraph">
          It is positioned so that each player has a light square on the right
          side corner closest to him or her.
        </p>
        <p className="rulesParagraph">
          A player wins the game when the opponent cannot make a move. In most
          cases, this is because all of the opponent's pieces have been
          captured, but it could also be because all of his pieces are blocked
          in.
        </p>
        <h6>Rules of the Game</h6>
        <ul>
          <li>
            Moves are allowed only on the dark squares, so pieces always move
            diagonally. Single pieces are always limited to forward moves
            (toward the opponent).
          </li>
          <li>
            A piece making a non-capturing move (not involving a jump) may move
            only one square.
          </li>
          <li>
            A piece making a capturing move (a jump) leaps over one of the
            opponent's pieces, landing in a straight diagonal line on the other
            side. Only one piece may be captured in a single jump; however,
            multiple jumps are allowed during a single turn.
          </li>
          <li>When a piece is captured, it is removed from the board.</li>
          <li>
            If a player is able to make a capture, there is no option; the jump
            must be made. If more than one capture is available, the player is
            free to choose whichever he or she prefers.
          </li>
          <li>
            When a piece reaches the furthest row from the player who controls
            that piece, it is crowned and becomes a king. One of the pieces
            which had been captured is placed on top of the king so that it is
            twice as high as a single piece.
          </li>
          <li>
            Kings are limited to moving diagonally but may move both forward and
            backward. (Remember that single pieces, i.e. non-kings, are always
            limited to forward moves.)
          </li>
          <li>
            Kings may combine jumps in several directions, forward and backward,
            on the same turn. Single pieces may shift direction diagonally
            during a multiple capture turn, but must always jump forward (toward
            the opponent).
          </li>
        </ul>
        <a className="takenFrom" href="https://www.thesprucecrafts.com/play-checkers-using-standard-rules-409287">Taken from thesprucecrafts.</a>
        </div>
      </div>
    );
  }
}

export default Rules;
