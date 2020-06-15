const express = require('express');

const Data = require('../data/db.js');

const router = express.Router();

/* POST */
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    Data.insert(req.body)
      .then((post) => {
        Data.findById(post.id)
          .then(p => {
            res.status(201).json(p);
          })
      })
      .catch(() => {
        res.status(500).json({ errorMessage: 'There was an error while saving the post to the database.' })
      })
  }

});

router.post('/:id/comments', (req, res) => {
  Data.findById(req.params.id)
    .then(comments => {
      if (comments.length > 0) {
        let comTmp = { ...req.body };
        comTmp.post_id = req.params.id;
        if (!comTmp.text) {
          res.status(400).json({ errorMessage: "Please provide text for the comment." });
        } else {
          Data.insertComment(comTmp)
            .then(comment => {
              Data.findCommentById(comment.id)
                .then(com => {
                  res.status(201).json(com);
                })
            })
            .catch(() => {
              res.status(500).json({ error: "There was an error while saving the comment to the database." });
            });
        }
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

/* GET */

router.get('/', (req, res) => {
  Data.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

router.get('/:id', (req, res) => {
  Data.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post[0]);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post information could not be retrieved." });
    });
});

router.get('/:id/comments', (req, res) => {
  Data.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        Data.findPostComments(req.params.id)
          .then(comments => {
            if (comments.length > 0) {
              res.status(200).json(comments);
            } else {
              res.status(404).json({ message: "The post has no comments." });
            }
          })
          .catch(() => {
            res.status(500).json({ error: "The comments information could not be retrieved." });
          });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post information could not be retrieved." });
    });

});

/* DELETE */
router.delete('/:id', (req, res) => {
  Data.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        Data.remove(req.params.id)
          .then(() => {
            res.status(200).json(post);
          })
          .catch(() => {
            res.status(500).json({ error: "The post could not be removed." });
          });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

/* PUT */
router.put('/:id', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    Data.update(req.params.id, req.body)
      .then(post => {
        if (post) {
          Data.findById(req.params.id)
            .then(p => {
              res.status(200).json(p);
            })
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(() => {
        res.status(500).json({ error: "The post information could not be modified." });
      });
  }
});


module.exports = router;