(defproject lese "0.1.0-SNAPSHOT"
  
  :description "FIXME: write description"
  
  :url "http://example.com/FIXME"
  
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.48"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [http-kit "2.1.19"]
                 [ring "1.4.0"]
                 [enlive "1.1.6"]
                 [compojure "1.4.0"]]
  
  :source-paths ["src/clj" "src/cljs"]

  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]

  :plugins [[lein-cljsbuild "1.0.5"]
            [lein-figwheel "0.3.8-SNAPSHOT"]]
  :cljsbuild {
    :builds [{:id "dev"
              :source-paths ["src/cljs"]

              :figwheel true 

              :compiler {:main cljs.lese.core
                         :asset-path "js/compiled/out"
                         :output-to "resources/public/js/compiled/main.js"
                         :output-dir "resources/public/js/compiled/out"
                         :source-map-timestamp true }}
             {:id "min"
              :source-paths ["src"]
              :compiler {:output-to "resources/public/js/compiled/main.js"
                         :main cljs.lese.core 
                         :optimizations :advanced
                         :pretty-print false}}]}
  )
