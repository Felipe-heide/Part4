const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0)

const mostLikes = (blogs) => blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc)

const mostBlogs = (blogs) => {

    if (blogs.length === 0) {
        return {}
    } else {
        let authorCounts = blogs.reduce((authorCount, blog) => {
            authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
            return authorCount
        }, {})

        let maxCount = Math.max(...Object.values(authorCounts))
        let mostFrequent = Object.keys(authorCounts).filter(author => authorCounts[author] === maxCount)
        return {
            author: mostFrequent[0],
            blogs: maxCount
        }
    }
  
  };
  const mostBlogslikes = (blogs) => {

    if (blogs.length === 0) {
      return {};
    } else {
      let authorLikesCount = blogs.reduce((authorCount, blog) => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + blog.likes;
        return authorCount;
      }, {});
      let maxLikes = Math.max(...Object.values(authorLikesCount));
      let mostLikedAuthor = Object.keys(authorLikesCount).filter(author => authorLikesCount[author] === maxLikes)[0];
      return {
        author: mostLikedAuthor,
        likes: maxLikes
      };
    }
  
  };
  
  
  
  module.exports = {
    totalLikes,
    mostLikes,
    mostBlogs,
    mostBlogslikes
  }