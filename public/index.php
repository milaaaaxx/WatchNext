<?php 
require_once __DIR__ . "/../config/database.php";
$pageTitle = "WatchNext";
 $message = isset($_GET["added"]) ? "item added to watchlist" : "" ;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"] ?? "add";
    if ($action === "delete") {
        $id = filter_var(
            $_POST["id"] ?? "",
            FILTER_VALIDATE_INT,
            ["options" => ["min_range" => 1]]
        );

        if ($id === false) {
            http_response_code(400);
            exit("invalid item");
        }

        $watched = $action ===  "mark_watched" ? 1 : 0;

        $statement = $pdo->prepare(
            "DELETE from watchlist WHERE id = :id"
        );

        $statement->execute(["id" => $id]);

        header("Location: /", true, 303);
        exit;
    }
    if ($action === "mark_watched" || $action === "mark_unwatched") {
        $id = filter_var($_POST["id"] ?? "", FILTER_VALIDATE_INT, ["options" => ["min_range" =>1]] );
    if ($id === false) {
        http_response_code(400);
        exit("invalid item");
    }
    $watched = $action === "mark_watched" ? 1 : 0;

    $statement = $pdo->prepare(
        "UPDATE watchlist SET watched  = :watched WHERE id = :id"
    );
    $statement->execute([
        "watched" => $watched,
        "id" => $id,
    ]);
    header("Location: /", true, 303);
    exit;
    }  
    $title = $_POST["title"] ?? "";
    $type = $_POST["type"] ?? "";

    if (!is_string($title) || !is_string($type)) {
        $message = "invalid input";
        
    } else {
        $title = trim($title);

        if ($title === "") {
            $message = "Please enter a title";
        } elseif (!in_array($type, ["movie", "series"], true)) {
            $message = "Please choose a movie or series";
        } else{ 
            $statement = $pdo->prepare(
                "INSERT INTO watchlist (title, type) VALUES (:title, :type)"
            );
            $statement->execute([
                ":title" => $title,
                ":type" => $type
            ]);
           header("Location: /?added=1", true, 303);
           exit;
        }
    }
}
$statement = $pdo->query(
    "SELECT id, title, type, watched, rating FROM watchlist ORDER BY id DESC"
);
$items = $statement->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?= $pageTitle ?> </title>
    <link rel="stylesheet" href="style.css">
     
</head>
<body>
    <main>
    <?=  $pageTitle ?>
    <p> To many options, nothin to watch:< </p>
    <p> your next obsession starts here</p>

    <form method="post">
        <div>
            <label for="title">Title</label>
            <input type="text" name="title" id="title" required>
        </div>
        <div>
            <label for="type">Type</label>
            <select name="type" id="type">
                <option value="movie">Movies</option>
                <option value="series">Series</option>
            </select>
        </div>
        <button type="submit">Add to watchlist</button>
    </form>
    <h2>YOUR WATCHLIST BABY:></h2>
    <?php if (empty($items)): ?>
        <p>Your watchlist is empty! Addd your first movie or series..</p>
        <?php else: ?>
            <ul>
                <?php foreach ($items as $item): ?>
                    <li>
                        <?= htmlspecialchars($item["title"], ENT_QUOTES, "UTF-8") ?>
                        —
                        <?= htmlspecialchars($item["type"], ENT_QUOTES, "UTF-8") ?>

                        <?php if ($item["watched"]): ?>
                         <p class="watch-status"> Watched - what's next? </p>
                         <form method="post" class="watch-action">
                            <input type="hidden" name="action" value="mark_unwatched">
                            <input type="hidden" name="id" value="<?=  (int) $item["id"]?>">
                            <button type="submit"> Mark As Unwatched :3</button>
                         </form>
                    <?php else:  ?>

                    <form method="post" class="watch-action">
                        <button type="submit">Mark as watched LESS GOOO</button>
                        <input type="hidden" name="action" value="mark_watched">
                        <input type="hidden"
                        name="id"
                        value="<?= (int)  $item["id"]?>"
                        >
                    </form>
                    <?php endif; ?>
                    <form class="watch-action" method="post">
                        <input type="hidden" name="action" value="delete">

                        <input type="hidden" name="id" value="<?= (int) $item["id"] ?>"
                        >

                        <button type="submit">delete</button>
                    </form>
                </li>
                <?php endforeach; ?>
            </ul>
            <?php endif; ?> 
    <?php if ($message !== ""): ?>
        <p><?=  htmlspecialchars($message, ENT_QUOTES, "UTF-8")  ?></p>
        <?php endif; ?>
        </main> 
    </body>
</html>