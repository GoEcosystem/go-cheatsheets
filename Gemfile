source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem "jekyll-theme-cayman"
gem "jekyll-seo-tag"
gem "jekyll-relative-links"
gem "jekyll-github-metadata"
gem "webrick", "~> 1.8"

# If you want to use GitHub Pages, uncomment the line below
# gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  # Add any other Jekyll plugins here
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.0` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
