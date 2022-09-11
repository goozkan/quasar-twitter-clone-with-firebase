<template>
  <q-page class="relative-position">
    <q-scroll-area
      class="absolute full-height full-width"
      :thumb-style="thumbStyle"
    >
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newQweetContent"
            placeholder="Yeni"
            counter
            maxlength="280"
            autogrow
            @keyup.enter="addNewQweet"
            class="new-queet-input"
          >
            <template v-slot:before>
              <q-avatar size="lg">
                <img src="images/g-avatar.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col-shrink q-pb-md">
          <q-btn
            @click="addNewQweet"
            unelevated
            rounded
            color="primary"
            label="Send"
            no-caps
            :disable="!newQweetContent"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="top-divider" />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-item v-for="qweet in qweets" :key="qweet.id" class="q-py-md">
            <q-item-section avatar top>
              <q-avatar>
                <img src="images/g-avatar.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-body1">
                <strong>Gokhan Ozkan</strong>
                <span class="grey-7 q-ml-md">
                  @goozkan <br class="lt-sm" />
                  <span class="gt-xs"> &bull;</span>
                  {{ relativeDate(qweet.date) }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm qweet-icons">
                <q-btn flat round color="grey" icon="chat_bubble_outline" />
                <q-btn flat round color="grey" icon="repeat" />
                <q-btn
                  flat
                  round
                  :color="qweet.liked ? 'red' : 'grey'"
                  :icon="qweet.liked ? 'favorite' : 'favorite_border'"
                  @click="toggleLiked(qweet)"
                />
                <q-btn
                  flat
                  round
                  @click="deleteQweet(qweet)"
                  color="grey"
                  icon="delete_outline"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { db } from "src/boot/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
    async addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      };
      let newQweetRef = doc(collection(db, "qweets"));
      await setDoc(newQweetRef, newQweet);
      this.newQweetContent = "";
    },
    async deleteQweet(qweet) {
      await deleteDoc(doc(db, "qweets", qweet.id));
    },
    async toggleLiked(qweet) {
      const likeQweetRef = doc(db, "qweets", qweet.id);

      // Set the "capital" field of the city 'DC'
      await updateDoc(likeQweetRef, {
        liked: !qweet.liked,
      });
    },
  },
  setup() {
    return {
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: "0.75",
      },
    };
  },
  mounted() {
    const q = collection(db, "qweets");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetsChange = change.doc.data();
        qweetsChange.id = change.doc.id;
        if (change.type === "added") {
          //console.log("New qweet: ", qweetsChange);
          this.qweets.unshift(qweetsChange);
        }
        if (change.type === "modified") {
          /*console.log("Modified qweet: ", qweetsChange);*/
          let index = this.qweets.findIndex(
            (qweet) => qweet.id == change.doc.id
          );
          Object.assign(this.qweets[index], qweetsChange);
        }
        if (change.type === "removed") {
          /*console.log("Removed qweet: ", qweetsChange)*/
          let index = this.qweets.findIndex(
            (qweet) => qweet.id == change.doc.id
          );
          this.qweets.splice(index, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-queet-input
  textarea
    font-size: 19px
    line-height: 1.4!important
.top-divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -10px
</style>
