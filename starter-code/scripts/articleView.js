'use strict'

var articleView = {};

articleView.populateFilters = function () {
  $('article').each(function () {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function () {
  $('#author-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }

    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function () {
  $('#category-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }

    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function () {
  $('.main-nav').on('click', '.tab', function () {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function () {
  $('.article-body *:nth-of-type(n+2)').hide();

  $('#articles').on('click', 'a.read-on', function (e) {
    e.preventDefault();
    $(this).parent().find('*').fadeIn();
    $(this).hide();
  });
};

articleView.initNewArticlePage = function () {
  $('.tab-content').show();

  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#article-json').on('focus', function () {
    this.select();
  });

  // TODO: Add an event handler to update the preview and the export field with info
  // from the article that WOULD BE created if any inputs change.
  $('#article-info').on('change', this.create);

};

articleView.create = function () {
  $('#articles').html('');

  var articleData = {
    title: $('[name="article-title"]').val(),
    body: $('[name="article-body"]').val(),
    author: $('[name="article-author"]').val(),
    authorUrl: $('[name="author-url"]').val(),
    category: $('[name="category"]').val(),
    publishedOn: $('[name="draft"]').attr('checked') ? null : new Date().toString(),
  };
  var newArticle = new Article(articleData);

  var renderFunc = Handlebars.compile($('#preview-template').html());

  // THIS AND THE NEXT BIT OF CODE ARE BOTH SLIGHTLY BROKEN. FIX THEM!
  // calculate how many days ago this article was published
  newArticle.daysAgo = parseInt((new Date() - new Date(newArticle.publishedOn)) / 60 / 60 / 24 / 1000);

  // set the publication status
  newArticle.publishStatus = newArticle.publishedOn ? `published ${newArticle.daysAgo} days ago` : '(draft)';

  // render the template with the proper data
  var renderedHtml = renderFunc(newArticle);
  $('#articles').append(renderedHtml);

  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  $('#article-json').val(JSON.stringify(newArticle) + ',');
};

// articleView.initNewArticlePage();

articleView.initIndexPage = function () {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
