<?php 
$pageTitle = "WatchNext";
$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = $_POST["title"] ?? "";
    $type = $_POST["type"] ?? "";

    if (!is_string($title) || !is_string($type)) {
        $message = "invalid input";
    } elseif (!in_array($type, ["movie", "series"], true)) {
       $message = "please choose a movie or series.";
    } else {
        $message = "Received: " . $title . " (" . $type . ")";
    }
} 
 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?= $pageTitle ?> o</title>
</head>
<body>
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
    <?php if ($message !== ""): ?>
        <p><?=  htmlspecialchars($message, ENT_QUOTES, "UTF-8")  ?></p>
        <?php endif; ?>
</body>
</html>