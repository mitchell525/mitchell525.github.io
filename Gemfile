source "https://rubygems.org"

gem "jekyll", "~> 3.9.5"
gem "kramdown-parser-gfm"

# All three must sit in :jekyll_plugins, not just be listed in _config.yml's
# `plugins:`. Jekyll 3 in --safe mode loads only what Bundler puts in this group,
# so seo-tag and sitemap outside it meant `bundle exec jekyll build --safe` died
# on "Unknown tag 'seo'" - the very command CLAUDE.md says to verify with.
# Production is unaffected either way: GitHub Pages ignores this Gemfile and
# whitelists these three itself.
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]