(ns lese.db
  (require [datomic.api :as d]
           [clojure.java.io :as io])
  (:import datomic.Util))

(def db-uri-base "datomic:free://0.0.0.0:4334")

(defn scratch-conn
  "Create a connection to an anonymous, in-memory database."
  []
  (let [uri (str "datomic:mem://" (d/squuid))]
    (d/delete-database uri)
    (d/create-database uri)
    (d/connect uri)))


(defn persistent-conn
  "Create connection to persistent datomic database"
  []
  (let [uri (str db-uri-base "/haushalt")]
    (d/create-database uri)
    (d/connect uri)))


(defn initialize-db [conn path]
  (doseq [txd (-> path io/resource io/reader Util/readAll)]
    (d/transact conn txd))
  :done)


(defn get-schema-elements
  "Get identifiers of schema elements"
  [db]
  (sort
   (d/q '[:find [?ident ...]
          :where [_ :db/ident ?ident]]
        db)))


(defn add-user
  "Add new user"
  [conn {:keys [email]}]
  (d/transact
   conn
   [{:db/id (d/tempid :db.part/user)
     :user/email email}])
  :done)


(defn get-user-id
  "Find user id given an email"
  [conn email]
  (let [query '[:find ?e
               :in $ ?email
               :where
                [?e :user/email ?email]]
        db (d/db conn)]
    (ffirst (d/q query db email))))

(defn get-tag-id
  "Find tag id given a tag name"
  [conn tag-name]
  (let [query '[:find ?e
                :in $ ?tname
                :where
                [?e :tag/name ?tname]]
        db (d/db conn)]
    (ffirst (d/q query db tag-name))))


(defn add-bookmark
  "Add new bookmark"
  [conn {:keys [url title email tags]}]
  (let [uid (get-user-id conn email)
        tids (map (partial get-tag-id conn) tags)]
    (d/transact
     conn
     [{:db/id (d/tempid :db.part/user)
       :bookmark/tags tids
       :bookmark/user uid
       :bookmark/url url
       :bookmark/title title}])
    ))


(defn get-user-bookmarks
  "retrieve all bookmarks of a given user"
  [email]
  
  )


(comment

  (def conn (scratch-conn))

  (def db (d/db conn))
  
  (initialize-db conn "schema.edn")


  )
